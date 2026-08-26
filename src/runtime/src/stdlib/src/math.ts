import {
    type NumberValue,
    RuntimeValueType, type StringValue,
} from "@types";
import {
    throw_exception,
    check_args_length,
    check_arg_type
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
} from "@types";

export const math: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "math",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "random_int",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "math::random_int");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::random_int");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "math::random_int");
                          const [min, max] = args.map(a => (a as any).value);
                          const random = Math.floor(Math.random() * (max - min + 1)) + min
                          return {type: RuntimeValueType.Number, value: random};
                      },
            } as NativeFunctionValue,
        ],
        [
            "random_float",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "math::random_float");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::random_float");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "math::random_float");
                          const [min, max] = args.map(a => (a as any).value);
                          const random = Math.random() * (max - min) + min
                          return {type: RuntimeValueType.Number, value: random};
                      },
            } as NativeFunctionValue,
        ],
        [
            "abs",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::abs");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::abs");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.abs(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "min",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "math::min");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::min");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "math::min");
                          const [a, b] = args.map(a => (a as any).value);
                          return {type: RuntimeValueType.Number, value: Math.min(a, b)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "max",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "math::max");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::max");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "math::max");
                          const [a, b] = args.map(a => (a as any).value);
                          return {type: RuntimeValueType.Number, value: Math.max(a, b)};
                      },
            } as NativeFunctionValue,
        ],
    ]),
};
