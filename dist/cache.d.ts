/**
 *
 * init cache as map obj
 *
 */
/**
 *
 * cash id for current state
 *
 */
export declare const injectState: <T>(id: string, initialState: T) => void;
/**
 *
 * update cach state with given id
 *
 */
export declare const update: <T>(id: string, newValues: T) => any;
declare const _default: {
    data: Map<any, any>;
    update: <T>(id: string, newValues: T) => any;
    injectState: <T_1>(id: string, initialState: T_1) => void;
};
export default _default;
//# sourceMappingURL=cache.d.ts.map