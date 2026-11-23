import {
    type ArrayValue,
    type MapValue,
    type NativeFunctionValue,
    type RangeValue,
    type RuntimeValue,
    RuntimeValueType,
    type SetValue,
    type StringValue,
    type StructValue
} from "@types";
import {check_arg_type, check_args_length, fleur_to_js_value, js_to_fleur_value, throw_exception} from "@utils";

export const json: StructValue =
    {
        type:       RuntimeValueType.Struct,
        identifier: "json",
        properties: new Map<string, RuntimeValue>(),
        methods:    new Map<string, any>([
            [
                "parse",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (args: RuntimeValue[]) =>
                          {
                              check_args_length(args, 1, "json::parse")
                              check_arg_type(args[0]!, RuntimeValueType.String, "json::parse")
                              const string = (args[0] as StringValue).value;
                              try
                              {
                                  const json = JSON.parse(string);
                                  return js_to_fleur_value(json);
                              }
                              catch (e: any)
                              {
                                  return throw_exception({
                                      type:     "Runtime",
                                      message:  `Failed to parse JSON`,
                                      metadata: e.message
                                  });
                              }
                          }
                } as NativeFunctionValue
            ],
            [
                "string",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (args: RuntimeValue[]) =>
                          {
                              check_args_length(args, 1, "json::string");
                              check_arg_type(args[0]!, [RuntimeValueType.Map, RuntimeValueType.Struct], "json::string")
                              const js_obj = fleur_to_js_value(args[0]!);

                              try
                              {
                                  const json_str = JSON.stringify(js_obj, null, 2);
                                  return {type: RuntimeValueType.String, value: json_str} as StringValue;
                              }
                              catch (e: any)
                              {
                                  return throw_exception({
                                      type:     "Runtime",
                                      message:  `Failed to stringify JSON`,
                                      metadata: e.message
                                  });
                              }
                          }
                } as NativeFunctionValue
            ],
        ])
    };