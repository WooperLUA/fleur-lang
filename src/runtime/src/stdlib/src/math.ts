import {
    type ArrayValue,
    type NativeFunctionValue,
    type NumberValue,
    type RangeValue,
    type RuntimeValue,
    RuntimeValueType,
    type SetValue,
    type StructValue,
} from "@types";
import {check_arg_type, check_args_length, throw_exception} from "@utils";

export const math: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "math",
    properties: new Map<string, RuntimeValue>([
        [
            "PI",
            {
                type:  RuntimeValueType.Number,
                value: Math.PI
            }
        ],
        [
            "INF",
            {
                type:  RuntimeValueType.Number,
                value: Infinity
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
            "sqrt",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::sqrt");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::sqrt");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.sqrt(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "pow",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "math::sqrt");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::sqrt");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "math::sqrt");
                          const base = (args[0] as NumberValue).value
                          const exp = (args[1] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.pow(base, exp)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "log",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [1, 2], "math::log");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::log");

                          const value = (args[0] as NumberValue).value
                          let base = null

                          if (args.length === 2)
                          {
                              check_arg_type(args[1]!, RuntimeValueType.Number, "math::log");
                              const potential_base = (args[1] as NumberValue).value
                              if (![10, 2, 1].includes(potential_base)) return throw_exception({
                                  type:    "Runtime",
                                  message: "Base should be either 10, 2 or 1 (for 1p)",
                              })
                              base = potential_base
                          }

                          let ope = Math.log
                          switch (base)
                          {
                              case 10:
                              {
                                  ope = Math.log10
                                  break;
                              }
                              case 2:
                              {
                                  ope = Math.log2
                                  break;
                              }
                              case 1:
                              {
                                  ope = Math.log1p
                                  break;
                              }
                          }

                          return {type: RuntimeValueType.Number, value: ope(value)};
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
            "acos",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::acos");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::acos");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.acos(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "asin",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::asin");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::asin");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.asin(value)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "atan",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::atan");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::atan");
                          const value = (args[0] as NumberValue).value
                          return {type: RuntimeValueType.Number, value: Math.atan(value)};
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
        ],
        [
            "sum",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::sum");
                          check_arg_type(args[0]!, [RuntimeValueType.Array, RuntimeValueType.Set, RuntimeValueType.Range], "math::sum");
                          switch ((args[0] as any).type)
                          {
                              case RuntimeValueType.Array:
                              case RuntimeValueType.Set:
                              {
                                  const array_or_set = (args[0] as ArrayValue | SetValue)
                                  for (const elt of array_or_set.elements)
                                  {
                                      if (elt.type !== RuntimeValueType.Number) return throw_exception({
                                          type:    "Runtime",
                                          message: `Elements of the ${array_or_set.type.split('.')} must be numbers`,
                                      })
                                  }
                                  const ds = array_or_set.elements as NumberValue[];
                                  const sum = ds.map(x => x.value).reduce((a, b) => a + b, 0)

                                  return {type: RuntimeValueType.Number, value: sum}
                              }
                              case RuntimeValueType.Range:
                              {
                                  const range = args[0] as RangeValue;
                                  const start = (range.start as NumberValue).value;
                                  const end = (range.end as NumberValue).value;
                                  let sum = 0;
                                  const step = start <= end ? 1 : -1;
                                  for (let i = start; step > 0 ? i <= end : i >= end; i += step)
                                  {
                                      sum += i;
                                  }
                                  return {type: RuntimeValueType.Number, value: Math.min(Math.max(sum, start), end)}
                              }
                          }
                      }
            }
        ],
        [
            "length",
            {
                type: RuntimeValueType.NativeFunction,
                is_method: false,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "math::length");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "math::length");

                          const val = (args[0] as NumberValue).value;
                          const digitCount = Math.abs(val).toString().replace(".", "").length;

                          return {
                              type: RuntimeValueType.Number,
                              value: digitCount,
                          } as NumberValue;
                      },
            } as NativeFunctionValue,
        ]
    ]),
};
