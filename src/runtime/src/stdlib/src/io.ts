import {
    RuntimeValueType, type StringValue,
} from "@types";
import {
    throw_exception,
    check_args_length,
    check_arg_type, stringify_value
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
} from "@types";

export const io: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "io",
    properties: new Map<string, RuntimeValue>([
        [
            "args",
            {
                type:     RuntimeValueType.Array,
                elements: []
            }
        ]
    ]),
    methods:    new Map<string, any>([
        [
            "print",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          console.log(...args.map(a => stringify_value(a)));
                          return {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "error",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          console.error(...args.map(a => stringify_value(a)));
                          return {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "clear",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 0, "clear");
                          console.clear()
                          return {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "read",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "io::read");
                          check_arg_type(args[0]!, RuntimeValueType.String, "io::read");

                          const value = (args[0] as StringValue).value

                          return {
                              type:  RuntimeValueType.String,
                              value: prompt(value ?? "") ?? ""
                          };
                      },
            } as NativeFunctionValue,
        ],
    ]),
};


