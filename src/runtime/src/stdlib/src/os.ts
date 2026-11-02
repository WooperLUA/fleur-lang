import {
    type NativeFunctionValue,
    type NumberValue,
    type RuntimeValue,
    RuntimeValueType,
    type StringValue,
    type StructValue,
} from "@types";
import {check_arg_type, check_args_length, throw_exception,} from "@utils";

import * as node_os from "node:os";
import {execSync} from "node:child_process";


export const os: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "os",
    properties: new Map<string, RuntimeValue>([
        [
            "platform",
            {
                type:  RuntimeValueType.String,
                value: process.platform
            }
        ],
        [
            "homedir",
            {
                type: RuntimeValueType.String,
                value: node_os.homedir()
            },
        ],
        [
            "cwd",
            {
                type: RuntimeValueType.String,
                value : process.cwd()
            }
        ],
        [
            "env",
            {
                type: RuntimeValueType.Struct,
                identifier: "os_env",
                properties : new Map<string, RuntimeValue>([]),
                methods:    new Map<string, any>([
                    [
                        "get",
                        {
                            type: RuntimeValueType.NativeFunction,
                            call: (args: RuntimeValue[]) =>
                                  {
                                      check_args_length(args, 1, "os.env::get");
                                      check_arg_type(args[0]!, RuntimeValueType.String, "os.env::get");
                                      const key = (args[0] as StringValue).value;
                                      const val = process.env[key];

                                      if (val === undefined)
                                      {
                                          return {type: RuntimeValueType.Null, value: null};
                                      }

                                      return {type: RuntimeValueType.String, value: val} as StringValue;
                                  },
                        } as NativeFunctionValue,
                    ],
                    [
                        "set",
                        {
                            type: RuntimeValueType.NativeFunction,
                            call: (args: RuntimeValue[]) =>
                                  {
                                      check_args_length(args, 2, "os.env::set");
                                      check_arg_type(args[0]!, RuntimeValueType.String, "os.env::set");
                                      check_arg_type(args[1]!, RuntimeValueType.String, "os.env::set");
                                      process.env[(args[0] as StringValue).value] = (args[1] as StringValue).value;
                                      return {type: RuntimeValueType.Null, value: null};
                                  },
                        } as NativeFunctionValue,
                    ],
                ]),
                is_immutable  : true,
            }
        ]
    ]),
    methods:    new Map<string, any>([
        [
            "exit",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "os::exit");
                          check_arg_type(args[0]!, RuntimeValueType.Number, "os::exit");
                          const code = (args[0] as NumberValue).value;
                          process.exit(code);
                      },
            } as NativeFunctionValue,
        ],
        [
            "exec",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "os::exec");
                          check_arg_type(args[0]!, RuntimeValueType.String, "os::exec");
                          const command = (args[0] as StringValue).value;

                          try
                          {
                              // execSync returns a Buffer, we convert it to a string and trim trailing newlines
                              const output = execSync(command, {encoding: "utf-8"});
                              return {type: RuntimeValueType.String, value: output.trimEnd()} as StringValue;
                          }
                          catch (e: any)
                          {
                              const exitCode = e.status !== undefined ? e.status : "unknown";
                              throw_exception({
                                  type:    "Runtime",
                                  message: `os::exec failed with exit code ${exitCode}.`
                              });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                      },
            } as NativeFunctionValue,
        ],
    ]),
};