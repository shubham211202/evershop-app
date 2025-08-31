export var SQLFilterOperation;
(function (SQLFilterOperation) {
    SQLFilterOperation["eq"] = "=";
    SQLFilterOperation["neq"] = "<>";
    SQLFilterOperation["gt"] = ">";
    SQLFilterOperation["gteq"] = ">=";
    SQLFilterOperation["lt"] = "<";
    SQLFilterOperation["lteq"] = "<=";
    SQLFilterOperation["like"] = "ILIKE";
    SQLFilterOperation["nlike"] = "NOT ILIKE";
    SQLFilterOperation["in"] = "IN";
    SQLFilterOperation["nin"] = "NOT IN";
})(SQLFilterOperation || (SQLFilterOperation = {}));
// Map the operation to the SQL operation
export const OPERATION_MAP = {
    eq: SQLFilterOperation.eq,
    neq: SQLFilterOperation.neq,
    gt: SQLFilterOperation.gt,
    gteq: SQLFilterOperation.gteq,
    lt: SQLFilterOperation.lt,
    lteq: SQLFilterOperation.lteq,
    like: SQLFilterOperation.like,
    nlike: SQLFilterOperation.nlike,
    in: SQLFilterOperation.in,
    nin: SQLFilterOperation.nin
};
//# sourceMappingURL=filterOperationMap.js.map