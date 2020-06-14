/*
 *
 * init cache as map obj
 *
 */

// use immtablejs
const cache = new Map();

// cash id for current state
export const injectState = <T>(id: string, initialState: T) => {
  id = (id || "").toString();

  // if no id we stop appending
  if (!id) {
    return;
  }

  // if cash has current id
  if (cache.has(id)) {
    throw new Error(`${id} id exsists`);
  }

  // if cash has't current id we append new entry it with initial value
  if (!cache.has(id)) {
    cache.set(id, initialState);

    return;
  }
};

// update cach state with given id
export const update = <T>(id: string, newValues: T) => {
  id = (id || "").toString();

  if (!id) {
    return null;
  }

  let currentIdCachedValues = cache.get(id);

  // 1- user will send partial state to update
  // 2- user will send whole state to update
  if (Array.isArray(currentIdCachedValues)) {
    currentIdCachedValues = [...currentIdCachedValues, newValues];

    cache.set(id, currentIdCachedValues);
    return currentIdCachedValues;
  }

  if (
    !Array.isArray(currentIdCachedValues) &&
    typeof currentIdCachedValues === "object"
  ) {
    currentIdCachedValues = { ...currentIdCachedValues, ...newValues };

    cache.set(id, currentIdCachedValues);
    return currentIdCachedValues;
  }

  currentIdCachedValues = newValues;

  cache.set(id, currentIdCachedValues);

  return currentIdCachedValues;
};

export default {
  data: cache,
  update,
  injectState,
};
