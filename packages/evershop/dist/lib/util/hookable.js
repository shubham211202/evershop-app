export var HookPosition;
(function (HookPosition) {
    HookPosition["BEFORE"] = "before";
    HookPosition["AFTER"] = "after";
})(HookPosition || (HookPosition = {}));
const beforeHooks = new Map();
const afterHooks = new Map();
let locked = false;
function isAsyncFunction(func) {
    return func.constructor.name === 'AsyncFunction';
}
function hook(funcName, callback, priority = 10, position = HookPosition.BEFORE) {
    if (locked) {
        throw new Error('Hooks are locked. You should consider adding hooks using the bootstrap function');
    }
    if (typeof callback !== 'function') {
        throw new Error('Callback must be a function');
    }
    if (typeof priority !== 'number') {
        throw new Error('Priority must be a number');
    }
    const storage = position === HookPosition.BEFORE ? beforeHooks : afterHooks;
    if (!storage.has(funcName)) {
        storage.set(funcName, []);
    }
    const hooks = storage.get(funcName);
    hooks.push({ callback, priority });
    hooks.sort((a, b) => a.priority - b.priority);
}
export function hookAfter(funcName, callback, priority = 10) {
    hook(funcName, callback, priority, HookPosition.AFTER);
}
export function hookBefore(funcName, callback, priority = 10) {
    hook(funcName, callback, priority, HookPosition.BEFORE);
}
export function hookable(originalFunction, context) {
    // Make sure the original function is a named function
    const funcName = originalFunction.name.replace('bound ', '');
    if (!funcName) {
        throw new Error('The original function must be a named function');
    }
    return new Proxy(originalFunction, {
        apply: isAsyncFunction(originalFunction)
            ? async function (target, thisArg, argumentsList) {
                const beforeHookFunctions = beforeHooks.get(funcName) || [];
                const afterHookFunctions = afterHooks.get(funcName) || [];
                for (let index = 0; index < beforeHookFunctions.length; index += 1) {
                    const callbackFunc = beforeHookFunctions[index].callback;
                    // Call the callback function with the cloned arguments
                    await callbackFunc.call(context, ...argumentsList);
                }
                const result = await Reflect.apply(target, thisArg, argumentsList);
                for (let index = 0; index < afterHookFunctions.length; index += 1) {
                    const callbackFunc = afterHookFunctions[index].callback;
                    await callbackFunc.call(context, result, ...argumentsList);
                }
                return result;
            }
            : function (target, thisArg, argumentsList) {
                const beforeHookFunctions = beforeHooks.get(funcName) || [];
                const afterHookFunctions = afterHooks.get(funcName) || [];
                // Clone the argumentsList to avoid mutation
                beforeHookFunctions.forEach((hook) => {
                    hook.callback.call(context, ...argumentsList);
                });
                const result = Reflect.apply(target, thisArg, argumentsList);
                afterHookFunctions.forEach((hook) => {
                    hook.callback.call(context, result, ...argumentsList);
                });
                return result;
            }
    });
}
export function getHooks() {
    return {
        beforeHooks,
        afterHooks
    };
}
export function clearHooks() {
    beforeHooks.clear();
    afterHooks.clear();
}
export function lockHooks() {
    locked = true;
}
//# sourceMappingURL=hookable.js.map