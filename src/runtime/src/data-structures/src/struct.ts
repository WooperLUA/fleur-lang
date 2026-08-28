import {
    type BooleanValue,
    RuntimeValueType,
    type StringValue,
} from "@types";
import {
    check_args_length,
    check_arg_type,
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
} from "@types";

export const struct: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "Struct",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "has_property",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<struct>::has_property");
                               check_arg_type(args[0]!, RuntimeValueType.Struct, "<struct>::has_property");
                               check_arg_type(args[1]!, RuntimeValueType.String, "<struct>::has_property");

                               const instance = args[0] as StructValue;
                               const key = (args[1] as StringValue).value;

                               return {
                                   type:  RuntimeValueType.Boolean,
                                   value: instance.properties.has(key) || instance.methods.has(key),
                               } as BooleanValue;
                           },
            } as NativeFunctionValue,
        ],
        [
            "struct_name",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<struct>::struct_name");
                               check_arg_type(args[0]!, RuntimeValueType.Struct, "<struct>::struct_name");

                               const instance = args[0] as StructValue;

                               return {
                                   type:  RuntimeValueType.String,
                                   value: instance.identifier,
                               } as StringValue;
                           },
            } as NativeFunctionValue,
        ],
    ]),
};