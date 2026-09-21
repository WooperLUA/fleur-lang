import {RuntimeValueType, type RangeValue, type NumberValue, type BooleanValue} from "@types";
import {check_args_length, check_arg_type, check_mutability} from "@utils";
import type { RuntimeValue, NativeFunctionValue, StructValue } from "@types";
export const range: StructValue = {
    type: RuntimeValueType.Struct,
    identifier: "Range",
    properties: new Map<string, RuntimeValue>(),
    methods: new Map<string, any>([
        [
            "new",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "Range::new");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "Range::new");
                          check_arg_type(args[1]!, RuntimeValueType.Number, "Range::new");

                          const start = (args[0]! as NumberValue);
                          const end = (args[1]! as NumberValue);

                          return {
                              type: RuntimeValueType.Range,
                              start: start,
                              end: end,
                          } as RangeValue;
                      }
            } as NativeFunctionValue
        ],
        [
            "contains",
            {
                type: RuntimeValueType.NativeFunction,
                is_method: true,
                call: (args: RuntimeValue[]) => {
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
                        type: RuntimeValueType.Boolean,
                        value: is_inside
                    } as BooleanValue;
                }
            } as NativeFunctionValue
        ],
        [
            "reverse",
            {
                type: RuntimeValueType.NativeFunction,
                is_method: true,
                call: (args: RuntimeValue[]) =>
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
                type: RuntimeValueType.NativeFunction,
                is_method: true,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "<range>::reverse");
                          const range = args[0]! as RangeValue;

                          return {
                              type: RuntimeValueType.Range,
                              start : range.end,
                              end: range.start,
                          } as RangeValue;
                      }
            }
        ],
    ])
};