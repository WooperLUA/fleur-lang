import {
    type BooleanValue,
    type NativeFunctionValue,
    type RuntimeValue,
    RuntimeValueType, type StringValue,
    type StructValue
} from "@types";
import {check_arg_type, check_args_length, throw_exception} from "@utils";

export const test: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "test",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "assert",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [1, 2], "test::assert");
                          check_arg_type(args[0]!, RuntimeValueType.Boolean, "test::assert");

                          const assertion = args[0]! as BooleanValue;
                          let assertion_name = "";
                          if (args.length == 2)
                          {
                              check_arg_type(args[1]!, RuntimeValueType.String, "test::assert");
                              assertion_name = (args[1]! as StringValue).value;
                          }
                          if (!assertion.value)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Assertion failed => ${assertion_name ? `"${assertion_name}"` : "[anonymous]"}`
                              });
                          }

                          return {type: RuntimeValueType.Boolean, value: true} as BooleanValue;
                      }
            } as NativeFunctionValue
        ],
    ])
};