import {
    type FunctionValue,
    type NativeFunctionValue,
    type ReturnValue,
    type RuntimeValue,
    RuntimeValueType
} from "@types";
import {Environment, evaluate, interpret} from "@runtime";

export const call_fleur_function = (func: FunctionValue | NativeFunctionValue, args: RuntimeValue[], this_val?: RuntimeValue): RuntimeValue =>
{
    if (func.type === RuntimeValueType.NativeFunction)
    {
        return (func as NativeFunctionValue).call(args);
    }

    const fn = func as FunctionValue;
    const call_env = new Environment(fn.env);

    if (this_val !== undefined)
    {
        call_env.declare("this", this_val, true);
    }

    for (let i = 0; i < fn.parameters.length; i++)
    {
        const param = fn.parameters[i]!;
        const arg_val = args[i] ?? (param.default_value ? evaluate(param.default_value, fn.env) : {type: RuntimeValueType.Null, value: null});
        call_env.declare(param.name, arg_val, false, param.type_annotation?.names);
    }

    const result = interpret({type: "Program", body: [fn.body]} as any, call_env);

    if (result.type === RuntimeValueType.Return)
    {
        return (result as ReturnValue).value;
    }

    return result;
};