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

export type SetHashParamsOptions = {
  usePush?: boolean;
};

export function atomWithHashParams(): WritableAtom<
  URLSearchParams | null,
  [SetStateAction<URLSearchParams | null>, options?: SetHashParamsOptions],
  void
> {
  const baseAtom = atom<URLSearchParams | null>(null);

  baseAtom.onMount = setAtom => {
    const update = () => {
      setAtom(new URLSearchParams(window.location.hash.replace(/^#/, '')));
    };

    window.addEventListener('hashchange', update);
    update();

    return () => {
      window.removeEventListener('hashchange', update);
    };
  };

  const derivedAtom = atom(
    get => get(baseAtom),
    (get, set, update: SetStateAction<URLSearchParams | null>, options?: SetHashParamsOptions) => {
      const nextValue = typeof update === 'function' ? update(get(derivedAtom)) : update;
      set(baseAtom, nextValue);

      const url = new URL(window.location.href);
      url.hash = nextValue?.toString() ?? '';
      if (options?.usePush === true) {
        window.history.pushState(null, '', url);
      } else {
        window.history.replaceState(null, '', url);
      }
    },
  );
  return derivedAtom;
}

export const hashParamsAtom = atomWithHashParams();

export type SetHashParamOptions = SetHashParamsOptions & {
  clearAll?: boolean;
};

export function atomWithHashParam<Value extends Json, DefaultValue extends Value>(
  key: string,
  schema: ZodSchema<Value, ZodTypeDef, unknown>,
  defaultValue: DefaultValue,
): WritableAtom<Value, [SetStateActionWithReset<Value>, options?: SetHashParamOptions], void> {
  const baseAtom = atom(
    get => {
      const hashParam = get(hashParamsAtom)?.get(key);
      if (hashParam == null) {
        return defaultValue;
      } else {
        return deserialize(hashParam);
      }
    },
    (get, set, update: SetStateActionWithReset<Json>, options?: SetHashParamOptions) => {
      const nextValue = typeof update === 'function' ? update(get(baseAtom)) : update;
      const hashParams = new URLSearchParams(
        options?.clearAll === true ? undefined : (get(hashParamsAtom) ?? undefined),
      );
      if (nextValue === RESET) {
        hashParams.delete(key);
      } else {
        hashParams.set(key, serialize(nextValue));
      }
      set(hashParamsAtom, hashParams, options);
    },
  );
  return atomWithSchema(baseAtom, schema, defaultValue);
}
