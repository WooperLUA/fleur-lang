import {type RuntimeValue, RuntimeValueType, type StructValue} from "@types";
import {throw_exception} from "@utils";

export const validate_runtime_type = (val: RuntimeValue, type_names: string[], context: string): void =>
{
    const primitive_map: Record<string, RuntimeValueType> = {
        "Number":    RuntimeValueType.Number,
        "String":    RuntimeValueType.String,
        "Boolean":   RuntimeValueType.Boolean,
        "Array":     RuntimeValueType.Array,
        "Set":       RuntimeValueType.Set,
        "Map":       RuntimeValueType.Map,
        "Range":     RuntimeValueType.Range,
        "Null":      RuntimeValueType.Null,
        "Function":  RuntimeValueType.Function,
        "Procedure": RuntimeValueType.Procedure,
        "NativeFunction":  RuntimeValueType.NativeFunction,
        "Struct":         RuntimeValueType.Struct,
        "Error":     RuntimeValueType.Error,
    };

    for (const type_name of type_names)
    {
        if (type_name in primitive_map)
        {
            if (val.type === primitive_map[type_name]) return;
        }
        else
        {
            if (val.type === RuntimeValueType.Struct && (val as StructValue).identifier === type_name) return;
        }
    }

    const actual_type = val.type === RuntimeValueType.Struct ? (val as StructValue).identifier : val.type;
    throw_exception({
        type:    "Runtime",
        message: `Type mismatch in ${context}: expected ${type_names.join(' or ')}, but got ${actual_type}.`
    });
};