import {
    type MapValue,
    type NumberValue,
    type RangeValue,
    type RuntimeValue,
    RuntimeValueType,
    type StructValue
} from "@types";
import {throw_exception} from "./exception";

export const check_arg_type = (arg: RuntimeValue, expected: RuntimeValueType | RuntimeValueType[], name: string): void =>
{
    const expectations = Array.isArray(expected) ? expected : [expected];

    if (!expectations.includes(arg.type))
    {
        const expected_str = Array.isArray(expected)
            ? expected.join(" or ")
            : expected;

        throw_exception({
            type:    "Runtime",
            message: `${name} expects argument of type ${expected_str}, but got ${arg.type}.`
        });
    }
}


export const is_primitive_value = (val: RuntimeValue): boolean =>
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
        case RuntimeValueType.Set:
        {
            const l = (left as any).elements as RuntimeValue[];
            const r = (right as any).elements as RuntimeValue[];
            if (l.length !== r.length) return false;
            return l.every(el => r.some(rEl => is_equal(el, rEl)));
        }
        case RuntimeValueType.Map:
        {
            const l = left as MapValue;
            const r = right as MapValue;
            if (l.elements.length !== r.elements.length) return false;
            return l.elements.every(l_elt =>
            {
                const r_idx = r.elements.findIndex(r_elt => is_equal(r_elt.key, l_elt.key));
                if (r_idx === -1) return false;
                return is_equal(l_elt.value, r.elements[r_idx]!.value);
            });
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
        case RuntimeValueType.Range:
        {
            const l = left as RangeValue;
            const r = right as RangeValue;

            return (l.start as NumberValue).value === (r.start as NumberValue).value &&
                (l.end as NumberValue).value === (r.end as NumberValue).value;
        }
        default:
            return left === right;
    }
};

// Add this to the bottom of the file
export const check_mutability = (val: RuntimeValue, operation: string): void =>
{
    if ((val as any).is_immutable)
    {
        throw_exception({
            type:    "Runtime",
            message: `Cannot perform '${operation}' on an immutable (const) value.`
        });
    }
}

export const deep_copy = (val: RuntimeValue): RuntimeValue =>
{
    if (!val) return val;
    switch (val.type)
    {
        case RuntimeValueType.Number:
        case RuntimeValueType.String:
        case RuntimeValueType.Boolean:
        case RuntimeValueType.Null:
        case RuntimeValueType.Function:
        case RuntimeValueType.Procedure:
        case RuntimeValueType.NativeFunction:
        case RuntimeValueType.Error:
            return val;
        case RuntimeValueType.Array:
            return {
                type:         RuntimeValueType.Array,
                elements:     (val as any).elements.map(deep_copy),
                is_immutable: (val as any).is_immutable
            };
        case RuntimeValueType.Set:
            return {
                type:         RuntimeValueType.Set,
                elements:     (val as any).elements.map(deep_copy),
                is_immutable: (val as any).is_immutable
            };
        case RuntimeValueType.Map:
            return {
                type:         RuntimeValueType.Map,
                elements:     (val as any).elements.map((el: { key: RuntimeValue; value: any; }) => ({
                    key:   deep_copy(el.key),
                    value: el.value
                })),
                is_immutable: (val as any).is_immutable
            };
        case RuntimeValueType.Struct:
            const s = val as StructValue;
            const copiedProps = new Map<string, RuntimeValue>();
            for (const [k, v] of s.properties.entries())
            {
                copiedProps.set(k, deep_copy(v));
            }
            return {
                type:       RuntimeValueType.Struct,
                identifier: s.identifier,
                properties: copiedProps,
                get methods()
                {
                    return s.methods;
                },
                is_declaration: s.is_declaration,
                is_immutable:   s.is_immutable
            };
        case RuntimeValueType.Range:
            return {
                type:  RuntimeValueType.Range,
                start: deep_copy((val as any).start),
                end:   deep_copy((val as any).end)
            };
        default:
            return val;
    }
};