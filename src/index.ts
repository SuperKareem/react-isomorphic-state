//TODO:  a research needed to understand the side effect of ignoring `React` namespace.
import * as R from "react";
import cache from "./cache";
import {
  SubscriberFunc,
  ConsumerResult,
  ResultProps,
  ConsumerProps,
} from "./interface";

//  initialize provider.
export const stateConsumer = <T>({
  id,
  initialState,
}: ConsumerProps<T>): ResultProps<T> => {
  let listeners: SubscriberFunc<T>[] = [];

  // Set function.
  // eslint-disable-next-line
  const callListeners = (newValue: T, callback: (newValue: T) => void) => {
    // update the cash
    cache.update(id, newValue);

    // notify caller subscriber direct.
    if (callback) {
      callback(newValue);
    }

    // Let subscribers know value did change async.
    setTimeout(() => {
      // call subscribers which are not the caller.
      listeners.forEach(
        (fn: SubscriberFunc<T>) => fn !== callback && fn(newValue)
      );
    });
  };

  //TODO: Check `useConsumerState` re-execution.
  const useConsumerState = (nextId?: string): ConsumerResult<T> => {
    const [state, setState] = R.useState<T>(initialState as T);

    // Add new entry state by `id` and add it to cache by the given `id`,
    // if it does not exsists.
    R.useEffect(() => {
      if (!cache.data.has(id)) {
        cache.injectState(id, initialState);
      }

      if (nextId !== id) {
        setState(cache.data.get(id));

        listeners.push(setState);
      }

      return () => {
        // eslint-disable-next-line
        listeners = listeners.filter((f) => f !== setState);
      };
    }, [setState, id, initialState, nextId]);

    // update state and call Listeners.
    const updater = R.useCallback(
      (preStateOrNextValue: T | SubscriberFunc<T>) => {
        // support previous as argument to new value.
        const newValue: T =
          preStateOrNextValue instanceof Function
            ? preStateOrNextValue(state)
            : preStateOrNextValue;
        callListeners(newValue, setState);
      },
      [setState, state]
    );

    return [state, updater, cache.data];
  };

  return {
    useConsumerState,
    useValue: () => useConsumerState(id)[0],
    getCach: () => cache.data,
  };
};
