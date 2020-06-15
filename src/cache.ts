/*
 *
 *  `react-isomorphic-state: `cache.ts`.
 *  Initialize cache
 *
 */
import { Map, fromJS, isImmutable } from "immutable";

// cash id for current state
export const injectState = <T>(
  id: string,
  initialState: T,
  cache: Map<string, any>
) => {
  id = (id || "").toString();
  const state = isImmutable(initialState) ? initialState : fromJS(initialState);

  // if no id we stop appending
  if (!id) {
    throw new Error(
      `Function \`injectState\`: \`id\` is required already exsists.`
    );
  }

  // if cash does not contain given id,
  // append new entry with given initial value
  if (!cache.has(id)) {
    return cache.set(id, state);
  }

  // if cash has current id
  throw new Error(`Function \`injectState\`: \`${id}\` already exsists.`);
};

// update cach state with given id
export const updateCache = <T>(
  path: string[] | string,
  newValues: T,
  cache: Map<string, any>
) => {
  if (typeof path === "string") {
    path = (path || "").toString();
    path = [path];
  }

  const values = isImmutable(newValues) ? newValues : fromJS(newValues);

  if (!path) {
    return undefined;
  }

  return cache.setIn(path, values);
};

export default {
  updateCache,
  injectState,
};
