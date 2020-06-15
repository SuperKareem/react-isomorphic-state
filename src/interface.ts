import * as R from "react";
import { Map } from "immutable";
export type ItratableSubscriber<T> = R.Dispatch<R.SetStateAction<Iterable<T>>>;

// export type SubscriberFunc<T= ItratableSubscriber<T>> = (
//   newState: T
// ) => ;

export interface ConsumerProps<T> {
  id: string;
  initialState?: T;
}

export type ConsumerResult<T> = [
  Iterable<T>,
  (preStateOrNextValue: Iterable<T> | UpdatedCallback<T>) => void,
  Map<string, any>
];

export interface ResultProps<T> {
  useConsumerState: () => ConsumerResult<T>;
  getCach: () => Map<string, T>;
}

export type UpdatedCallback<T> = (oldState: Iterable<T>) => Iterable<T>;
