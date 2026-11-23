import type {NativeFunctionValue, RuntimeValue, StructValue} from "@types";
import {type BooleanValue, type NumberValue, type RangeValue, RuntimeValueType} from "@types";
import {check_arg_type, check_args_length, check_mutability, validate_range_step} from "@utils";

export const range: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "Range",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "new",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [2, 3], "Range::new");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "Range::new");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "Range::new");

                          if (args.length === 2)
                          {
                              const start = (args[0]! as NumberValue);
                              const end = (args[1]! as NumberValue);

                              return {
                                  type:  RuntimeValueType.Range,
                                  start: start,
                                  end:   end,
                              } as RangeValue;
                          }

                          check_arg_type(args[2]!, RuntimeValueType.Number, "Range::new");
                          const start = (args[0]! as NumberValue);
                          const step = (args[1]! as NumberValue);
                          const end = args[2]! as NumberValue;
                          validate_range_step(step, "Range::new");

                          return {
                              type:  RuntimeValueType.Range,
                              start: start,
                              end:   end,
                              step:  {type: RuntimeValueType.Number, value: Math.abs(step.value)}
                          } as RangeValue;
                      }
            } as NativeFunctionValue
        ],
        [
            "start",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<range>::start");
                               const rangeVal = args[0]! as RangeValue;
                               const start = (rangeVal.start as NumberValue).value;

                               return {
                                   type:  RuntimeValueType.Number,
                                   value: start,
                               } as NumberValue;
                           }
            }
        ],
        [
            "end",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<range>::end");
                               const rangeVal = args[0]! as RangeValue;
                               const end = (rangeVal.end as NumberValue).value;

                               return {
                                   type:  RuntimeValueType.Number,
                                   value: end,
                               } as NumberValue;
                           }
            }
        ],
        [
            "step",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<range>::step");
                               const rangeVal = args[0]! as RangeValue;
                               const step = rangeVal.step ? (rangeVal.step as NumberValue).value : 1;

                               return {
                                   type:  RuntimeValueType.Number,
                                   value: step,
                               } as NumberValue;
                           }
            }
        ],
        [
            "contains",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 2, "<range>::contains");
                               check_arg_type(args[0]!, RuntimeValueType.Range, "<range>::contains");
                               check_arg_type(args[1]!, RuntimeValueType.Number, "<range>::contains");

                               const rangeVal = args[0]! as RangeValue;
                               const value = (args[1] as NumberValue).value;
                               const start = (rangeVal.start as NumberValue).value;
                               const end = (rangeVal.end as NumberValue).value;

                               const is_ascending = start <= end;
                               const is_inside = is_ascending
                                   ? (value >= start && value <= end)
                                   : (value <= start && value >= end);

                               return {
                                   type:  RuntimeValueType.Boolean,
                                   value: is_inside
                               } as BooleanValue;
                           }
            } as NativeFunctionValue
        ],
        [
            "reverse",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<range>::reverse");
                               check_mutability(args[0]!, "<range>::reverse");
                               const range = args[0]! as RangeValue;

                               const temp = range.start;
                               range.start = range.end;
                               range.end = temp;

                               return range;
                           }
            }
        ],
        [
            "reversed",
            {
                type:      RuntimeValueType.NativeFunction,
                is_method: true,
                call:      (args: RuntimeValue[]) =>
                           {
                               check_args_length(args, 1, "<range>::reverse");
                               const range = args[0]! as RangeValue;

                               return {
                                   type:  RuntimeValueType.Range,
                                   start: range.end,
                                   end:   range.start,
                                   ...(range.step ? {step: range.step} : {}),
                               } as RangeValue;
                           }
            }
        ],
    ])
};