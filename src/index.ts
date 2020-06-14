import * as R from 'react';
import cache from './cache';
import { SubscriberFunc, ConsumerResult, ResultProps, ConsumerProps } from './interface';




/**
 * 
 * initialize provider
 */

export const stateConsumer = <T>({
  id,
  initialState
}: ConsumerProps<T>): ResultProps<T> => {
  
  let listeners: SubscriberFunc<T>[] = [];

    // set function
    // eslint-disable-next-line
    const callListeners = (newValue: T, callback: (newValue: T) => void) => {
      
      // update the cash
      cache.update(id, newValue);

      // notify caller subscriber direct
      if(callback){
        callback(newValue);
      }

      // let subscribers know value did change async
      setTimeout(() => {
        // call subscribers which are not the caller
        listeners.forEach((fn: SubscriberFunc<T>) => fn !== callback && fn(newValue));
      });
    };


    const useConsumerState = (): ConsumerResult<T> => {
      const [state, setState] = R.useState<T>(initialState as T);

      /**
       * add new entry state by id if not exsist 
       * init state with cahced data by given id
       * 
       */

      R.useEffect(() => {
        if(!cache.data.has(id)){
          cache.injectState(id, initialState)
        }
    
        setState(cache.data.get(id))
    
        listeners.push(setState);
    
        return () => {
          // eslint-disable-next-line
          listeners = listeners.filter((f) => f !== setState);
        };
    
      }, [setState, id, initialState])


      /**
       * update state and call Listeners
       */
      const updater = R.useCallback((preStateOrNextValue: T | SubscriberFunc<T>) => {
        // support previous as argument to new value
      const newValue: T  = preStateOrNextValue instanceof Function ? preStateOrNextValue(state) : preStateOrNextValue;

        callListeners(newValue, setState);

      }, [setState, state])

      return [state, updater, cache.data];
    };


  return {
    useConsumerState,
    useValue: () => useConsumerState()[0],
    getCach: () => cache.data,
  }
};

export default stateConsumer;



