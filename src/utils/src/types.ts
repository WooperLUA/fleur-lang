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
            const l_step = l.step ? (l.step as NumberValue).value : 1;
            const r_step = r.step ? (r.step as NumberValue).value : 1;

            return (l.start as NumberValue).value === (r.start as NumberValue).value &&
                (l.end as NumberValue).value === (r.end as NumberValue).value &&
                l_step === r_step;
        }
        default:
            return left === right;
    }
};

export const validate_range_step = (step: NumberValue, name: string): void =>
{
    if (!Number.isFinite(step.value) || step.value === 0)
    {
        throw_exception({
            type:    "Runtime",
            message: `${name} step must be a non-zero number.`
        });
    }
};

export type RangeIteration = {
    start: number;
    end: number;
    step: number;
    epsilon: number;
};

export const get_range_iteration = (range: RangeValue, name: string = "Range"): RangeIteration =>
{
    if (range.start.type !== RuntimeValueType.Number || range.end.type !== RuntimeValueType.Number)
    {
        throw_exception({type: "Runtime", message: "Range bounds must be numbers."});
    }

    const start = (range.start as NumberValue).value;
    const end = (range.end as NumberValue).value;
    const has_step = range.step !== undefined && range.step !== null;

    if (has_step)
    {
        validate_range_step(range.step!, name);
    }

    const magnitude = has_step ? Math.abs((range.step as NumberValue).value) : 1;

    if (!has_step && (!Number.isInteger(start) || !Number.isInteger(end)) && Math.abs(end - start) < 1)
    {
        throw_exception({
            type:    "Runtime",
            message: `Float range ${start}..${end} has a difference of less than 1. Since the default step is 1, it would only yield the start value. Use a 'while' loop for fractional steps.`
        });
    }

    return {
        start,
        end,
        step:    start <= end ? magnitude : -magnitude,
        epsilon: has_step ? magnitude * 1e-10 : 1e-10,
    };
};

// Add this to the bottom of the file
export const check_mutability = (val: RuntimeValue, operation: string, recommendation?: string): void =>
{
    if ((val as any).is_immutable)
    {
        throw_exception({
            type:    "Runtime",
            message: `Cannot perform '${operation}' on an immutable (const) value.`,
            metadata : recommendation,
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
            };
        case RuntimeValueType.Set:
            return {
                type:         RuntimeValueType.Set,
                elements:     (val as any).elements.map(deep_copy),
            };
        case RuntimeValueType.Map:
            return {
                type:         RuntimeValueType.Map,
                elements:     (val as any).elements.map((el: { key: RuntimeValue; value: any; }) => ({
                    key:   deep_copy(el.key),
                    value: el.value
                })),
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
            };
        case RuntimeValueType.Range:
            return {
                type:  RuntimeValueType.Range,
                start: deep_copy((val as any).start),
                end:   deep_copy((val as any).end),
                ...((val as any).step ? {step: deep_copy((val as any).step) as NumberValue} : {})
            };
        default:
            return val;
    }
};