import {type RangeValue, RuntimeValueType} from "@types";

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
            return "Set(" + val.elements.map((e: any) => stringify_value(e)).join(", ") + ")";
        case RuntimeValueType.Struct:
            return val.identifier + " { " + Array.from(val.properties.entries()).map((entry) =>
            {
                const [k, v] = entry as [string, any];
                return `${k}: ${stringify_value(v)}`;
            }).join(", ") + " }";
        case RuntimeValueType.Function:
            return `[Function: ${val.identifier}]`;
        case RuntimeValueType.Procedure:
            return `[Procedure: ${val.identifier}]`;
        case RuntimeValueType.Null:
            return "null";
        case RuntimeValueType.Range:
            return `${stringify_value((val as RangeValue).start)}..${stringify_value((val as RangeValue).end)}`;
        default:
            return String(val.value);
    }
}