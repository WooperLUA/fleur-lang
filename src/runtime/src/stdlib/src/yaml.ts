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
import { YAML } from "bun";

export const yaml: StructValue =
    {
        type:       RuntimeValueType.Struct,
        identifier: "yaml",
        properties: new Map<string, RuntimeValue>(),
        methods:    new Map<string, any>([
            [
                "parse",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (args: RuntimeValue[]) =>
                          {
                              check_args_length(args, 1, "yaml::parse")
                              check_arg_type(args[0]!, RuntimeValueType.String, "yaml::parse")
                              const string = (args[0] as StringValue).value;
                              try
                              {
                                  const yaml = YAML.parse(string);
                                  return js_to_fleur_value(yaml);
                              }
                              catch (e: any)
                              {
                                  return throw_exception({
                                      type:     "Runtime",
                                      message:  `Failed to parse YAML`,
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
                              check_args_length(args, 1, "yaml::string");
                              check_arg_type(args[0]!, [RuntimeValueType.Map, RuntimeValueType.Struct], "yaml::string")
                              const js_obj = fleur_to_js_value(args[0]!);

                              try
                              {
                                  const yaml_str = YAML.stringify(js_obj, null, 2);
                                  return {type: RuntimeValueType.String, value: yaml_str} as StringValue;
                              }
                              catch (e: any)
                              {
                                  return throw_exception({
                                      type:     "Runtime",
                                      message:  `Failed to stringify YAML`,
                                      metadata: e.message
                                  });
                              }
                          }
                } as NativeFunctionValue
            ],
        ])
    };