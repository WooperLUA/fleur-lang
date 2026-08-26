import {type RuntimeValue, RuntimeValueType} from "@types";
import {throw_exception} from "./exception";

export const check_arg_type = (arg: RuntimeValue, expected: RuntimeValueType, name: string): void =>
{
    if (arg.type !== expected)
    {
        throw_exception({
            type:    "Runtime",
            message: `${name} expects argument of type ${expected}, but got ${arg.type}.`
        });
    }
}

export const is_simple_value = (val: RuntimeValue): boolean =>
{
    return [
        RuntimeValueType.Number,
        RuntimeValueType.Boolean,
        RuntimeValueType.String,
        RuntimeValueType.Null,
    ].includes(val.type);
}

export const is_equal = (left: RuntimeValue, right: RuntimeValue): boolean =>
{
    if (left.type !== right.type) return false;

    switch (left.type)
    {
        case RuntimeValueType.Number:
        case RuntimeValueType.String:
        case RuntimeValueType.Boolean:
            return (left as any).value === (right as any).value;
        case RuntimeValueType.Null:
            return true;
        case RuntimeValueType.Array:
        {
            const l = (left as any).elements as RuntimeValue[];
            const r = (right as any).elements as RuntimeValue[];
            if (l.length !== r.length) return false;
            return l.every((el, i) => is_equal(el, r[i]!));
        }
        case RuntimeValueType.Struct:
        {
            const l = left as any;
            const r = right as any;
            if (l.identifier !== r.identifier) return false;
            if (l.properties.size !== r.properties.size) return false;
            for (const [key, val] of l.properties)
            {
                if (!r.properties.has(key)) return false;
                if (!is_equal(val, r.properties.get(key)!)) return false;
            }
            return true;
        }
        default:
            return left === right;
    }
};
