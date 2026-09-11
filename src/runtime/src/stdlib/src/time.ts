import {
    type NumberValue,
    RuntimeValueType,
} from "@types";
import {
    check_args_length,
    check_arg_type
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
} from "@types";

export const time: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "time",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "wait",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "time::wait");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "time::wait");
                          const value = (args[0] as NumberValue).value
                          Bun.sleepSync(value)
                          return {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "now",
            {
                type: RuntimeValueType.NativeFunction,
                call: (_: RuntimeValue[]) =>
                      {
                          return {type: RuntimeValueType.Number, value: Date.now()};
                      },
            } as NativeFunctionValue,
        ],
    ]),
};
