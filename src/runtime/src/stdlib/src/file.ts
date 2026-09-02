import {
    RuntimeValueType,
    type StringValue,
    type BooleanValue,
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
import * as fs from "node:fs";
import * as node_path from "node:path";


export const file: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "file",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "read",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "file::read");
                          check_arg_type(args[0]!, RuntimeValueType.String, "file::read");

                          const path = (args[0] as StringValue).value;
                          try
                          {
                              const content = fs.readFileSync(path, "utf-8");
                              return {type: RuntimeValueType.String, value: content} as StringValue;
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to read file '${path}': ${e.message}`
                              });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                      },
            } as NativeFunctionValue,
        ],
        [
            "write",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "file::write");
                          check_arg_type(args[0]!, RuntimeValueType.String, "file::write");
                          check_arg_type(args[1]!, RuntimeValueType.String, "file::write");

                          const path = (args[0] as StringValue).value;
                          const content = (args[1] as StringValue).value;

                          try
                          {
                              fs.writeFileSync(path, content, "utf-8");
                              return {type: RuntimeValueType.Null, value: null};
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to write file '${path}': ${e.message}`
                              });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                      },
            } as NativeFunctionValue,
        ],
        [
            "append",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "file::append");
                          check_arg_type(args[0]!, RuntimeValueType.String, "file::append");
                          check_arg_type(args[1]!, RuntimeValueType.String, "file::append");

                          const path = (args[0] as StringValue).value;
                          const content = (args[1] as StringValue).value;

                          try
                          {
                              fs.appendFileSync(path, content, "utf-8");
                              return {type: RuntimeValueType.Null, value: null};
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to append to file '${path}': ${e.message}`
                              });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                      },
            } as NativeFunctionValue,
        ],
        [
            "exists",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "file::exists");
                          check_arg_type(args[0]!, RuntimeValueType.String, "file::exists");

                          const path = (args[0] as StringValue).value;
                          return {type: RuntimeValueType.Boolean, value: fs.existsSync(path)} as BooleanValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "remove",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "file::remove");
                          check_arg_type(args[0]!, RuntimeValueType.String, "file::remove");

                          const path = (args[0] as StringValue).value;
                          try
                          {
                              fs.unlinkSync(path);
                              return {type: RuntimeValueType.Null, value: null};
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to remove file '${path}': ${e.message}`
                              });
                              return {type: RuntimeValueType.Null, value: null};
                          }
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
                              check_arg_type(arg, RuntimeValueType.String, "file::join_path");
                              return (arg as StringValue).value;
                          });
                          return {type: RuntimeValueType.String, value: node_path.join(...parts)} as StringValue;
                      },
            } as NativeFunctionValue,
        ],
    ]),
};