"use strict";
/*
 *
 * init cache as map obj
 *
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.injectState = void 0;
// use immtablejs
var cache = new Map();
// cash id for current state
exports.injectState = function (id, initialState) {
    id = (id || "").toString();
    // if no id we stop appending
    if (!id) {
        return;
    }
    // if cash has current id
    if (cache.has(id)) {
        throw new Error(id + " id exsists");
    }
    // if cash has't current id we append new entry it with initial value
    if (!cache.has(id)) {
        cache.set(id, initialState);
        return;
    }
};
// update cach state with given id
exports.update = function (id, newValues) {
    id = (id || "").toString();
    if (!id) {
        return null;
    }
    var currentIdCachedValues = cache.get(id);
    // 1- user will send partial state to update
    // 2- user will send whole state to update
    if (Array.isArray(currentIdCachedValues)) {
        currentIdCachedValues = __spreadArrays(currentIdCachedValues, [newValues]);
        cache.set(id, currentIdCachedValues);
        return currentIdCachedValues;
    }
    if (!Array.isArray(currentIdCachedValues) &&
        typeof currentIdCachedValues === "object") {
        currentIdCachedValues = __assign(__assign({}, currentIdCachedValues), newValues);
        cache.set(id, currentIdCachedValues);
        return currentIdCachedValues;
    }
    currentIdCachedValues = newValues;
    cache.set(id, currentIdCachedValues);
    return currentIdCachedValues;
};
exports.default = {
    data: cache,
    update: exports.update,
    injectState: exports.injectState,
};
//# sourceMappingURL=cache.js.map