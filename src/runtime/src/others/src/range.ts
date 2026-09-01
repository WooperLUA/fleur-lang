import {RuntimeValueType, type RangeValue, type NumberValue} from "@types";
import { check_args_length, check_arg_type } from "@utils";
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
    ])
};