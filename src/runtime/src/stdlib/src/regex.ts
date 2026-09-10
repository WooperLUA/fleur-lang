import type {BooleanValue, NativeFunctionValue, NullValue, RuntimeValue, StructValue, ArrayValue} from "@types";
import {RuntimeValueType, type StringValue} from "@types";
import {check_arg_type, check_args_length, throw_exception} from "@utils";

export const regex: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "regex",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "test",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [2, 3], "regex::test")
                          check_arg_type(args[0]!, RuntimeValueType.String, "regex::test");
                          check_arg_type(args[1]!, RuntimeValueType.String, "regex::test");

                          const pattern = (args[0]! as StringValue).value;
                          const str = (args[1]! as StringValue).value;

                          let flags = "";
                          if (args[2])
                          {
                              check_arg_type(args[2]!, RuntimeValueType.String, "regex::test");
                              flags = (args[2]! as StringValue).value;
                          }

                          try
                          {
                              const regexp = new RegExp(pattern, flags);
                              return {type: RuntimeValueType.Boolean, value: regexp.test(str)} as BooleanValue;
                          }
                          catch(e : any)
                          {
                              return throw_exception({
                                  type : "Runtime",
                                  message: e.message,
                              });
                          }
                      },
            } as NativeFunctionValue,
        ],
        [
            "match",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, [2, 3], "regex::match")
                          check_arg_type(args[0]!, RuntimeValueType.String, "regex::match");
                          check_arg_type(args[1]!, RuntimeValueType.String, "regex::match");

                          const pattern = (args[0]! as StringValue).value;
                          const str = (args[1]! as StringValue).value;

                          let flags = "";
                          if (args[2])
                          {
                              check_arg_type(args[2]!, RuntimeValueType.String, "regex::match");
                              flags = (args[2]! as StringValue).value;
                          }

                          try
                          {
                              const regexp = new RegExp(pattern, flags);
                              const match_array = regexp.exec(str);

                              if (!match_array)
                              {
                                  return {type: RuntimeValueType.Null, value: null} as NullValue;
                              }

                              // JS array -> Fleur ArrayValue
                              return {
                                  type:     RuntimeValueType.Array,
                                  elements: match_array.map(m => ({
                                      type:  RuntimeValueType.String,
                                      value: m
                                  }))
                              } as ArrayValue;
                          }
                          catch(e : any)
                          {
                              return throw_exception({
                                  type : "Runtime",
                                  message: e.message,
                              });
                          }
                      },
            } as NativeFunctionValue,
        ],
    ]),
};