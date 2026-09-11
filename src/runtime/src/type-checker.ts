import {type RuntimeValue, RuntimeValueType, type StructValue} from "@types";
import {throw_exception} from "@utils";

export const validate_runtime_type = (val: RuntimeValue, type_name: string, context: string): void =>
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
    };

    if (type_name in primitive_map)
    {
        if (val.type !== primitive_map[type_name])
        {
            throw_exception({
                type:    "Runtime",
                message: `Type mismatch in ${context}: expected ${type_name}, but got ${val.type}.`
            });
        }
    }
    else
    {
        if (val.type !== RuntimeValueType.Struct || (val as StructValue).identifier !== type_name)
        {
            const actual_type = val.type === RuntimeValueType.Struct ? (val as StructValue).identifier : val.type;
            throw_exception({
                type:    "Runtime",
                message: `Type mismatch in ${context}: expected ${type_name}, but got ${actual_type}.`
            });
        }
    }
};