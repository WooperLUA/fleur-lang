import { RuntimeValueType, type StringValue, type ErrorValue } from "@types";
import { check_args_length, check_arg_type, LysError } from "@utils";
import type { RuntimeValue, NativeFunctionValue, StructValue } from "@types";

export const error: StructValue = {
    type: RuntimeValueType.Struct,
    identifier: "Error",
    properties: new Map<string, RuntimeValue>(),
    methods: new Map<string, any>([
        [
            "new",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "Error::new");
                          check_arg_type(args[0]!, RuntimeValueType.String, "Error::new");
                          const msg = (args[0] as StringValue).value;

                          return {
                              type: RuntimeValueType.Error,
                              message: msg,
                          } as ErrorValue;
                      }
            } as NativeFunctionValue
        ],
        [
            "throw",
            {
                type: RuntimeValueType.NativeFunction,
                is_method: true,
                call: (args: RuntimeValue[]) =>
                      {
                          throw new LysError(args[0]!);
                      }
            } as NativeFunctionValue
        ]
    ])
};