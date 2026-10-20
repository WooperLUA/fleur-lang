import {
    RuntimeValueType,
    type StringValue,
    type BooleanValue,
    type ArrayValue,
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

export const dir: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "dir",
    properties: new Map<string, RuntimeValue>(),
    methods:    new Map<string, any>([
        [
            "read",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "dir::read");
                          check_arg_type(args[0]!, RuntimeValueType.String, "dir::read");

                          const path = (args[0] as StringValue).value;

                          try
                          {
                              const entries = fs.readdirSync(path);
                              const content = entries.map(name => ({
                                  type: RuntimeValueType.String,
                                  value: name
                              }));
                              return {type: RuntimeValueType.Array, elements: content} as ArrayValue;
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to read directory '${path}': ${e.message}`
                              });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                      },
            } as NativeFunctionValue,
        ],
        [
            "make",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "dir::make");
                          check_arg_type(args[0]!, RuntimeValueType.String, "dir::make");

                          const path = (args[0] as StringValue).value;

                          try
                          {
                              fs.mkdirSync(path, { recursive: true });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to create directory '${path}': ${e.message}`
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
                          check_args_length(args, 1, "dir::exists");
                          check_arg_type(args[0]!, RuntimeValueType.String, "dir::exists");

                          const path = (args[0] as StringValue).value;

                          try
                          {
                              const stat = fs.statSync(path);
                              return {type: RuntimeValueType.Boolean, value: stat.isDirectory()} as BooleanValue;
                          }
                          catch
                          {
                              return {type: RuntimeValueType.Boolean, value: false} as BooleanValue;
                          }
                      },
            } as NativeFunctionValue,
        ],
        [
            "remove",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "dir::remove");
                          check_arg_type(args[0]!, RuntimeValueType.String, "dir::remove");

                          const path = (args[0] as StringValue).value;

                          if (fs.statSync(path).isFile())
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `'${path}' is a file. Use file::remove instead.`
                              });
                          }

                          try
                          {
                              fs.rmSync(path, { recursive: true, force: true });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to remove directory '${path}': ${e.message}`
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
                              check_arg_type(arg, RuntimeValueType.String, "dir::join_path");
                              return (arg as StringValue).value;
                          });
                          return {type: RuntimeValueType.String, value: node_path.join(...parts)} as StringValue;
                      },
            } as NativeFunctionValue,
        ],
        [
            "rename",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "dir::rename");
                          check_arg_type(args[0]!, RuntimeValueType.String, "dir::rename");
                          check_arg_type(args[1]!, RuntimeValueType.String, "dir::rename");

                          const old_path = (args[0] as StringValue).value;
                          const new_path = (args[1] as StringValue).value;

                          try
                          {
                              if (!fs.existsSync(old_path))
                              {
                                  throw_exception({
                                      type:    "Runtime",
                                      message: `Cannot rename '${old_path}': Directory does not exist.`
                                  });
                              }

                              if (fs.statSync(old_path).isFile())
                              {
                                  throw_exception({
                                      type:    "Runtime",
                                      message: `'${old_path}' is a file. Use file::rename instead.`
                                  });
                              }

                              if (fs.existsSync(new_path) && fs.statSync(new_path).isFile())
                              {
                                  throw_exception({
                                      type:    "Runtime",
                                      message: `Cannot rename to '${new_path}': Target is an existing file.`
                                  });
                              }

                              fs.renameSync(old_path, new_path);
                              return {type: RuntimeValueType.Null, value: null};
                          }
                          catch (e: any)
                          {
                              if (e.name === "FleurError") throw e;

                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to rename '${old_path}' to '${new_path}': ${e.message}`
                              });
                              return {type: RuntimeValueType.Null, value: null};
                          }
                      },
            } as NativeFunctionValue,
        ],
    ]),
};