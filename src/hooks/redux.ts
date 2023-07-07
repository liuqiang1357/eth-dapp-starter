import { useSelector as useReduxSelector, useStore as useReduxStore } from 'react-redux';
import { Dispatch, State, Store } from 'store';

export function useStore(): Store {
  return useReduxStore() as Store;
}

export function useDispatch(): Dispatch {
  return useStore().dispatch;
}

export type Selector<R> = (rootState: State) => R;

export function useSelector<R>(
  selector: Selector<R>,
  equalityFn?: (left: R, right: R) => boolean,
): R {
  return useReduxSelector(selector, equalityFn);
}
