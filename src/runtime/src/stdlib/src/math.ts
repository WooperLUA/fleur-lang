import {
    type NumberValue, type RangeValue,
    RuntimeValueType,
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
    properties: new Map<string, RuntimeValue>([
        [
            "PI",
            {
                type:     RuntimeValueType.Number,
                value: Math.PI
            }
        ]
    ]),
    methods:    new Map<string, any>([
        [
            "random",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::random");
                          check_arg_type(args[0]!, RuntimeValueType.Range, "math::random");

                          const range = args[0] as RangeValue;
                          const start = (range.start as NumberValue).value;
                          const end = (range.end as NumberValue).value;

                          if (Number.isInteger(start))
                          {
                              if (!Number.isInteger(end))
                              {
                                  return throw_exception({
                                      type:    "Runtime",
                                      message: `You must pass either two integers or two floats.`,
                                  })
                              }
                              const random = Math.floor(Math.random() * (end - start + 1)) + start
                              return {type: RuntimeValueType.Number, value: random}
                          }
                          else
                          {
                              if (Number.isInteger(end))
                              {
                                  return throw_exception({
                                      type:    "Runtime",
                                      message: `You must pass either two integers or two floats.`,
                                  })
                              }
                              const random = Math.random() * (end - start) + start
                              return {type: RuntimeValueType.Number, value: random}
                          }
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
        [
            "round",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::round");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::round");
                          const value = (args[0] as NumberValue).value;
                          return {type: RuntimeValueType.Number, value: Math.round(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "floor",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::floor");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::floor");
                          const value = (args[0] as NumberValue).value;
                          return {type: RuntimeValueType.Number, value: Math.floor(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "ceil",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::ceil");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::ceil");
                          const value = (args[0] as NumberValue).value;
                          return {type: RuntimeValueType.Number, value: Math.ceil(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "cos",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::cos");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::cos");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.cos(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "sin",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::sin");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::sin");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.sin(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "tan",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::tan");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::tan");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.tan(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "float",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::float");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::float");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: value.toFixed(1)}
                      }
            }
        ],
        [
            "int",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::int");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::int");
                          const value = String((args[0] as NumberValue).value)
                          return {type: RuntimeValueType.Number, value: parseInt(value)}
                      }
            }
        ],
        [
            "clamp",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "math::clamp");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::clamp");
                          check_arg_type(args[1]!, RuntimeValueType.Range, "math::clamp");
                          const value = (args[0] as NumberValue).value
                          const range = args[1] as RangeValue;
                          const start = (range.start as NumberValue).value;
                          const end = (range.end as NumberValue).value;

                          return {type: RuntimeValueType.Number, value: Math.min(Math.max(value, start), end)}
                      }
            }
        ]

    ]),
};
