import { atom, createStore, SetStateAction, WritableAtom } from 'jotai';
import { atomWithStorage as jotaiAtomWithStorage, RESET } from 'jotai/utils';
import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';
import { ZodSchema, ZodTypeDef } from 'zod';
import { deserialize, Json, serialize } from './json';

export const store = createStore();

type SetStateActionWithReset<Value> =
  | Value
  | typeof RESET
  | ((prev: Value) => Value | typeof RESET);

export function atomWithSchema<
  Value extends Json,
  DefaultValue extends Value,
  ExtraArgs extends unknown[],
>(
  baseAtom: WritableAtom<Json, [SetStateActionWithReset<Json>, ...ExtraArgs], void>,
  schema: ZodSchema<Value, ZodTypeDef, unknown>,
  defaultValue: DefaultValue,
): WritableAtom<Value, [SetStateActionWithReset<Value>, ...ExtraArgs], void> {
  const derivedAtom = atom(
    get => {
      const result = schema.safeParse(get(baseAtom));
      return result.success ? result.data : defaultValue;
    },
    (get, set, update: SetStateActionWithReset<Value>, ...args: ExtraArgs) => {
      const nextValue = typeof update === 'function' ? update(get(derivedAtom)) : update;
      set(baseAtom, nextValue === defaultValue ? RESET : nextValue, ...args);
    },
  );
  return derivedAtom;
}

export function atomWithStorage<Value extends Json, DefaultValue extends Value>(
  key: string,
  schema: ZodSchema<Value, ZodTypeDef, unknown>,
  defaultValue: DefaultValue,
  storage?: SyncStorage<Json>,
): WritableAtom<Value, [SetStateActionWithReset<Value>], void> {
  const baseAtom = jotaiAtomWithStorage(key, null, storage);
  return atomWithSchema(baseAtom, schema, defaultValue);
}

export type SetSearchParamsOptions = {
  usePush?: boolean;
};

export function atomWithSearchParams(): WritableAtom<
  URLSearchParams | null,
  [SetStateAction<URLSearchParams | null>, options?: SetSearchParamsOptions],
  void
> {
  const baseAtom = atom<URLSearchParams | null>(null);

  baseAtom.onMount = setAtom => {
    const update = () => {
      setTimeout(() => {
        setAtom(new URLSearchParams(window.location.search));
      });
    };

    const originPushState = window.history.pushState;
    const originReplaceState = window.history.replaceState;

    window.history.pushState = (...args: Parameters<typeof originPushState>) => {
      originPushState.call(window.history, ...args);
      update();
    };
    window.history.replaceState = (...args: Parameters<typeof originReplaceState>) => {
      originReplaceState.call(window.history, ...args);
      update();
    };
    window.addEventListener('popstate', update);

    update();

    return () => {
      window.history.pushState = originPushState;
      window.history.replaceState = originReplaceState;
      window.removeEventListener('popstate', update);
    };
  };

  const derivedAtom = atom(
    get => get(baseAtom),
    (
      get,
      set,
      update: SetStateAction<URLSearchParams | null>,
      options?: SetSearchParamsOptions,
    ) => {
      const nextValue = typeof update === 'function' ? update(get(derivedAtom)) : update;
      set(baseAtom, nextValue);

      const url = new URL(window.location.href);
      url.search = nextValue?.toString() ?? '';
      if (options?.usePush === true) {
        window.history.pushState(history.state, '', url);
      } else {
        window.history.replaceState(history.state, '', url);
      }
    },
  );
  return derivedAtom;
}

export const searchParamsAtom = atomWithSearchParams();

export function atomWithSearchParam<Value extends Json, DefaultValue extends Value>(
  key: string,
  schema: ZodSchema<Value, ZodTypeDef, unknown>,
  defaultValue: DefaultValue,
): WritableAtom<Value, [SetStateActionWithReset<Value>, options?: SetSearchParamsOptions], void> {
  const baseAtom = atom(
    get => {
      const searchParam = get(searchParamsAtom)?.get(key);
      if (searchParam == null) {
        return defaultValue;
      } else {
        return deserialize(searchParam);
      }
    },
    (get, set, update: SetStateActionWithReset<Json>, options?: SetSearchParamsOptions) => {
      const nextValue = typeof update === 'function' ? update(get(baseAtom)) : update;
      const searchParams = new URLSearchParams(get(searchParamsAtom) ?? undefined);
      if (nextValue === RESET) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, serialize(nextValue));
      }
      set(searchParamsAtom, searchParams, options);
    },
  );
  return atomWithSchema(baseAtom, schema, defaultValue);
}
