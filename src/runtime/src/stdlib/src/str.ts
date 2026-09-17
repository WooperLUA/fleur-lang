import {
    type NullValue,
    type NumberValue, type RangeValue,
    RuntimeValueType, type StringValue,
} from "@types";
import {
    check_args_length, check_arg_type, throw_exception, stringify_value,
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
} from "@types";

export const str: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "str",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "length",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "str::length");
                          check_arg_type(args[0]!, RuntimeValueType.String, "str::length");
                          const value = (args[0] as StringValue).value
                          return {type: RuntimeValueType.Number, value: value.length};
                      },
            } as NativeFunctionValue,
        ],
        [
            "trim",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "str::trim");
                          check_arg_type(args[0]!, RuntimeValueType.String, "str::trim");
                          const value = (args[0] as StringValue).value
                          return {type: RuntimeValueType.String, value: value.trim()};
                      },
            } as NativeFunctionValue,
        ],
        [
            "upper",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "str::upper");
                          check_arg_type(args[0]!, RuntimeValueType.String, "str::upper");
                          const value = (args[0] as StringValue).value
                          return {type: RuntimeValueType.String, value: value.toUpperCase()};
                      },
            } as NativeFunctionValue,
        ],
        [
            "lower",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "str::lower");
                          check_arg_type(args[0]!, RuntimeValueType.String, "str::lower");
                          const value = (args[0] as StringValue).value
                          return {type: RuntimeValueType.String, value: value.toLowerCase()};
                      },
            } as NativeFunctionValue,
        ],
        [
            "contains",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "str::contains");
                          check_arg_type(args[0]!, RuntimeValueType.String, "str::contains");
                          check_arg_type(args[1]!, RuntimeValueType.String, "str::contains");
                          const [str, substr]: string[] = args.map(a => (a as any).value);
                          return {type: RuntimeValueType.Boolean, value: str!.includes(substr!)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "at",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "str::at");
                          check_arg_type(args[0]!, RuntimeValueType.String, "str::at");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "str::at");
                          const value = (args[0] as StringValue).value
                          const index = (args[1] as NumberValue).value;
                          return {type: RuntimeValueType.String, value: value.at(index)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "slice",
            {
                type:      RuntimeValueType.NativeFunction,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "str::slice");
                               check_arg_type(args[0]!, RuntimeValueType.String, "str::slice");
                               check_arg_type(args[1]!, RuntimeValueType.Range, "str::slice");

                               const str = (args[0] as StringValue).value;
                               const range = args[1] as RangeValue;

                               const startVal = (range.start as NumberValue).value;
                               const endVal = (range.end as NumberValue).value;

                               const len = str.length;

                               let start = startVal < 0 ? len + startVal : startVal;
                               let end = endVal < 0 ? len + endVal : endVal;

                               const elements: string[] = [];
                               const step = start <= end ? 1 : -1;

                               for (let i = start; step > 0 ? i <= end : i >= end; i += step)
                               {
                                   if (i >= 0 && i < len)
                                   {
                                       elements.push(str[i]!);
                                   }
                               }

                               return {
                                   type:     RuntimeValueType.String,
                                   value: elements.join(''),
                               } as StringValue;
                           },
            } as NativeFunctionValue,
        ],
        [
            "join",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          if (args.length < 3) throw_exception({
                              type:    "Runtime",
                              message: `str::join expects at least 3 arguments.`
                          });
                          check_arg_type(args[0]!, RuntimeValueType.String, "str::join");
                          const separator = (args[0]! as StringValue).value;
                          const strs = args.slice(1).map(x => stringify_value(x));
                          return {type: RuntimeValueType.String, value: strs.join(separator)};
                      },
            } as NativeFunctionValue,
        ],
        [
            "unicode",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "str::unicode");
                          check_arg_type(args[0]!, RuntimeValueType.String, "str::unicode");
                          const value = (args[0] as StringValue).value
                          if (value.length > 1) return throw_exception({
                              type: "Runtime",
                              message: `You must provide a string of length 1 (a character)`
                          })
                          const unicode = value.codePointAt(0);
                          return {type: RuntimeValueType.Number, value: unicode} as NumberValue
                      },
            } as NativeFunctionValue,
        ],
    ]),
};
