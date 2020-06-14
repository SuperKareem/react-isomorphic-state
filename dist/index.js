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
var R = __importStar(require("react"));
var cache_1 = __importDefault(require("./cache"));
/**
 *
 * initialize provider
 */
exports.stateConsumer = function (_a) {
    var id = _a.id, initialState = _a.initialState;
    var listeners = [];
    // set function
    // eslint-disable-next-line
    var callListeners = function (newValue, callback) {
        // update the cash
        cache_1.default.update(id, newValue);
        // notify caller subscriber direct
        if (callback) {
            callback(newValue);
        }
        // let subscribers know value did change async
        setTimeout(function () {
            // call subscribers which are not the caller
            listeners.forEach(function (fn) { return fn !== callback && fn(newValue); });
        });
    };
    var useConsumerState = function () {
        var _a = R.useState(initialState), state = _a[0], setState = _a[1];
        /**
         * add new entry state by id if not exsist
         * init state with cahced data by given id
         *
         */
        R.useEffect(function () {
            if (!cache_1.default.data.has(id)) {
                cache_1.default.injectState(id, initialState);
            }
            setState(cache_1.default.data.get(id));
            listeners.push(setState);
            return function () {
                // eslint-disable-next-line
                listeners = listeners.filter(function (f) { return f !== setState; });
            };
        }, [setState, id, initialState]);
        /**
         * update state and call Listeners
         */
        var updater = R.useCallback(function (preStateOrNextValue) {
            // support previous as argument to new value
            var newValue = preStateOrNextValue instanceof Function ? preStateOrNextValue(state) : preStateOrNextValue;
            callListeners(newValue, setState);
        }, [setState, state]);
        return [state, updater, cache_1.default.data];
    };
    return {
        useConsumerState: useConsumerState,
        useValue: function () { return useConsumerState()[0]; },
        getCach: function () { return cache_1.default.data; },
    };
};
exports.default = exports.stateConsumer;
//# sourceMappingURL=index.js.map