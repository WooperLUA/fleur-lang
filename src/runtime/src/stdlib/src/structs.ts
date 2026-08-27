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

export const structs: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "structs",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "has",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "structs::has");
                          check_arg_type(args[0]!, RuntimeValueType.Struct, "structs::has");
                          check_arg_type(args[1]!, RuntimeValueType.String, "structs::has");

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
            "name",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "structs::name");
                          check_arg_type(args[0]!, RuntimeValueType.Struct, "structs::name");

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
