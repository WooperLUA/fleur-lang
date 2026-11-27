import {type MapValue, type RangeValue, RuntimeValueType, type StringValue, type StructValue} from "@types";
import {call_fleur_function} from "./functions.ts";

export const stringify_value = (val: any): string =>
{
    if (!val || typeof val.type === 'undefined')
    {
        return String(val);
    }

    switch (val.type)
    {
        case RuntimeValueType.Number:
            return String(val.value);
        case RuntimeValueType.Boolean:
            return String(val.value);
        case RuntimeValueType.String:
            return val.value;
        case RuntimeValueType.Array:
            return "[" + val.elements.map((e: any) => stringify_value(e)).join(", ") + "]";
        case RuntimeValueType.Set:
            return "(" + val.elements.map((e: any) => stringify_value(e)).join(", ") + ")";
        case RuntimeValueType.Map:
            return "{ " + (val as MapValue).elements.map((el) =>
            {
                return `${stringify_value(el.key)}: ${stringify_value(el.value)}`;
            }).join(", ") + " }";
        case RuntimeValueType.Struct:
            const instance = (val as StructValue);
            if (!instance.methods.has("string"))
                return val.identifier + " { " + Array.from(val.properties.entries())
                                                     .map((entry) =>
                                                     {
                                                         const [k, v] = entry as [string, any];
                                                         return `${k}: ${stringify_value(v)}`;
                                                     })
                                                     .join(", ") + " }";
            const string_method = instance.methods.get("string");
            return (call_fleur_function(string_method!, [], instance) as StringValue).value;
        case RuntimeValueType.Function:
            return `<Function: ${val.identifier}>`;
        case RuntimeValueType.Procedure:
            return `<Procedure: ${val.identifier}>`;
        case RuntimeValueType.NativeFunction:
            return `<NativeFunction>`;
        case RuntimeValueType.Null:
            return "null";
        case RuntimeValueType.Range:
        {
            const range = val as RangeValue;
            const start = stringify_value(range.start);
            const end = stringify_value(range.end);

            return range.step
                ? `${start}..${stringify_value(range.step)}..${end}`
                : `${start}..${end}`;
        }
        case RuntimeValueType.Error:
            return `<Error: ${(val as any).message}>`;
        case RuntimeValueType.Return:
            return stringify_value((val as any).value);
        case RuntimeValueType.Break:
            return "<break>";
        case RuntimeValueType.Continue:
            return "<continue>";
        default:
            return String(val.value);
    }
}