import {
    RuntimeValueType,
    type StringValue,
    type NumberValue,
} from "@types";
import {
    throw_exception,
    check_args_length,
    check_arg_type,
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
} from "@types";

import * as node_os from "node:os";
import {execSync} from "node:child_process";
import * as node_path from "node:path";

export const os: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "os",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "env",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "os::env");
                          check_arg_type(args[0]!, RuntimeValueType.String, "os::env");
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
            "set_env",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "os::set_env");
                          check_arg_type(args[0]!, RuntimeValueType.String, "os::set_env");
                          check_arg_type(args[1]!, RuntimeValueType.String, "os::set_env");
                          process.env[(args[0] as StringValue).value] = (args[1] as StringValue).value;
                          return {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "platform",
            {
                type: RuntimeValueType.NativeFunction,
                call: (_: RuntimeValue[]) =>
                      {
                          return {type: RuntimeValueType.String, value: process.platform} as StringValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "homedir",
            {
                type: RuntimeValueType.NativeFunction,
                call: (_: RuntimeValue[]) =>
                      {
                          return {type: RuntimeValueType.String, value: node_os.homedir()} as StringValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "join_path",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          const parts = args.map(arg =>
                          {
                              check_arg_type(arg, RuntimeValueType.String, "os::join_path");
                              return (arg as StringValue).value;
                          });
                          return {type: RuntimeValueType.String, value: node_path.join(...parts)} as StringValue;
                      },
            } as NativeFunctionValue,
        ],
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