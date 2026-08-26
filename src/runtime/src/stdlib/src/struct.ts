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
    identifier: "struct",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "has",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "struct::has");
                          check_arg_type(args[0]!, RuntimeValueType.Struct, "struct::has");
                          check_arg_type(args[1]!, RuntimeValueType.String, "struct::has");

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
            "get_type",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "struct::get_type");
                          check_arg_type(args[0]!, RuntimeValueType.Struct, "struct::get_type");

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
