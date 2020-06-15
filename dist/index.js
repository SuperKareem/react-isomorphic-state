"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateConsumer = void 0;
//TODO:  a research needed to understand the side effect of ignoring `React` namespace.
var R = __importStar(require("react"));
var cache_1 = __importDefault(require("./cache"));
//  initialize provider.
exports.stateConsumer = function (_a) {
    var id = _a.id, initialState = _a.initialState;
    var listeners = [];
    // Set function.
    // eslint-disable-next-line
    var callListeners = function (newValue, callback) {
        // update the cash
        cache_1.default.update(id, newValue);
        // notify caller subscriber direct.
        if (callback) {
            callback(newValue);
        }
        // Let subscribers know value did change async.
        setTimeout(function () {
            // call subscribers which are not the caller.
            listeners.forEach(function (fn) { return fn !== callback && fn(newValue); });
        });
    };
    //TODO: Check `useConsumerState` re-execution.
    var useConsumerState = function (nextId) {
        var _a = R.useState(initialState), state = _a[0], setState = _a[1];
        // Add new entry state by `id` and add it to cache by the given `id`,
        // if it does not exsists.
        R.useEffect(function () {
            if (!cache_1.default.data.has(id)) {
                cache_1.default.injectState(id, initialState);
            }
            if (nextId !== id) {
                setState(cache_1.default.data.get(id));
                listeners.push(setState);
            }
            return function () {
                // eslint-disable-next-line
                listeners = listeners.filter(function (f) { return f !== setState; });
            };
        }, [setState, id, initialState, nextId]);
        // update state and call Listeners.
        var updater = R.useCallback(function (preStateOrNextValue) {
            // support previous as argument to new value.
            var newValue = preStateOrNextValue instanceof Function
                ? preStateOrNextValue(state)
                : preStateOrNextValue;
            callListeners(newValue, setState);
        }, [setState, state]);
        return [state, updater, cache_1.default.data];
    };
    return {
        useConsumerState: useConsumerState,
        useValue: function () { return useConsumerState(id)[0]; },
        getCach: function () { return cache_1.default.data; },
    };
};
//# sourceMappingURL=index.js.map