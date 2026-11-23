import {
    type ArrayValue, type MapValue,
    type NativeFunctionValue, type RangeValue,
    type RuntimeValue,
    RuntimeValueType, type SetValue,
    type StringValue,
    type StructValue
} from "@types";

export const fleur_to_js_value = (val: RuntimeValue): any =>
{
    switch (val.type)
    {
        case RuntimeValueType.Number:
        case RuntimeValueType.String:
        case RuntimeValueType.Boolean:
            return (val as any).value;

        case RuntimeValueType.Null:
            return null;

        case RuntimeValueType.Array:
            return (val as ArrayValue).elements.map(fleur_to_js_value);

        case RuntimeValueType.Set:
            return (val as SetValue).elements.map(fleur_to_js_value);

        case RuntimeValueType.Struct:
        {
            const obj: any = {};
            const struct = val as StructValue;
            for (const [k, v] of struct.properties.entries())
            {
                obj[k] = fleur_to_js_value(v);
            }
            return obj;
        }

        case RuntimeValueType.Map:
        {
            const map = val as MapValue;
            let all_string_keys = true;
            for (const el of map.elements)
            {
                if (el.key.type !== RuntimeValueType.String)
                {
                    all_string_keys = false;
                    break;
                }
            }

            if (all_string_keys)
            {
                const obj: any = {};
                for (const el of map.elements)
                {
                    obj[(el.key as StringValue).value] = fleur_to_js_value(el.value);
                }
                return obj;
            }
            else
            {
                return map.elements.map(el => [
                    fleur_to_js_value(el.key),
                    fleur_to_js_value(el.value)
                ]);
            }
        }

        case RuntimeValueType.Range:
        {
            const range = val as RangeValue;
            const result: any = {start: fleur_to_js_value(range.start), end: fleur_to_js_value(range.end)};

            if (range.step)
            {
                result.step = fleur_to_js_value(range.step);
            }

            return result;
        }

        case RuntimeValueType.Error:
            return {error: (val as any).message};

        default:
            return null;
    }
};

export const js_to_fleur_value = (js_val: any): RuntimeValue =>
{
    if (js_val === null || js_val === undefined) return {type: RuntimeValueType.Null, value: null};
    if (typeof js_val === 'number') return {type: RuntimeValueType.Number, value: js_val};
    if (typeof js_val === 'string') return {type: RuntimeValueType.String, value: js_val};
    if (typeof js_val === 'boolean') return {type: RuntimeValueType.Boolean, value: js_val};

    if (Array.isArray(js_val))
    {
        return {type: RuntimeValueType.Array, elements: js_val.map(js_to_fleur_value)} as ArrayValue;
    }

    if (typeof js_val === 'object')
    {
        const elements: { key: RuntimeValue; value: RuntimeValue }[] = [];

        for (const [key, value] of Object.entries(js_val))
        {
            elements.push({
                key:   {type: RuntimeValueType.String, value: key},
                value: js_to_fleur_value(value)
            });
        }

        return {
            type:     RuntimeValueType.Map,
            elements: elements
        } as MapValue;
    }

    return {type: RuntimeValueType.Null, value: null};
};