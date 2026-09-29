import {
    RuntimeValueType,
    type StringValue,
    type BooleanValue,
    type ArrayValue,
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
                          check_args_length(args, [1, 2], "file::read");
                          check_arg_type(args[0]!, RuntimeValueType.String, "file::read");

                          const path = (args[0] as StringValue).value;
                          const encoding = args[1] ? (args[1] as StringValue).value.toLowerCase() : "utf-8";

                          try
                          {
                              if (encoding === "bytes")
                              {
                                  const buffer = fs.readFileSync(path);
                                  const content = Array.from(buffer).map(byte => ({
                                      type: RuntimeValueType.Number,
                                      value: byte
                                  }));
                                  return {type: RuntimeValueType.Array, elements: content} as ArrayValue;
                              }
                              else
                              {
                                  const content = fs.readFileSync(path, encoding as BufferEncoding);
                                  return {type: RuntimeValueType.String, value: content} as StringValue;
                              }
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
                          check_args_length(args, [2, 3], "file::write");
                          check_arg_type(args[0]!, RuntimeValueType.String, "file::write");

                          const path = (args[0] as StringValue).value;
                          const content = args[1]!;
                          const encoding = args[2] ? (args[2] as StringValue).value.toLowerCase() : "utf-8";

                          try
                          {
                              if (encoding === "bytes")
                              {
                                  check_arg_type(content, RuntimeValueType.Array, "file::write (bytes encoding)");
                                  const arr = content as ArrayValue;
                                  const uint8 = new Uint8Array(arr.elements.length);

                                  for (let i = 0; i < arr.elements.length; i++)
                                  {
                                      const el = arr.elements[i]!;
                                      if (el.type !== RuntimeValueType.Number)
                                      {
                                          throw_exception({
                                              type: "Runtime",
                                              message: `file::write expects an array of numbers for bytes encoding, got ${el.type} at index ${i}.`
                                          });
                                      }

                                      const num = (el as NumberValue).value;
                                      if (num < 0 || num > 255 || !Number.isInteger(num))
                                      {
                                          throw_exception({
                                              type: "Runtime",
                                              message: `file::write expects bytes (0-255), got ${num} at index ${i}.`
                                          });
                                      }
                                      uint8[i] = num;
                                  }
                                  fs.writeFileSync(path, uint8);
                              }
                              else
                              {
                                  check_arg_type(content, RuntimeValueType.String, `file::write (${encoding} encoding)`);
                                  const str_content = (content as StringValue).value;
                                  fs.writeFileSync(path, str_content, encoding as BufferEncoding);
                              }
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
                          check_args_length(args, [2, 3], "file::append");
                          check_arg_type(args[0]!, RuntimeValueType.String, "file::append");

                          const path = (args[0] as StringValue).value;
                          const content = args[1]!;
                          const encoding = args[2] ? (args[2] as StringValue).value.toLowerCase() : "utf-8";

                          try
                          {
                              if (encoding === "bytes")
                              {
                                  check_arg_type(content, RuntimeValueType.Array, "file::append (bytes encoding)");
                                  const arr = content as ArrayValue;
                                  const uint8 = new Uint8Array(arr.elements.length);

                                  for (let i = 0; i < arr.elements.length; i++)
                                  {
                                      const el = arr.elements[i]!;
                                      if (el.type !== RuntimeValueType.Number)
                                      {
                                          throw_exception({
                                              type: "Runtime",
                                              message: `file::append expects an array of numbers for bytes encoding, got ${el.type} at index ${i}.`
                                          });
                                      }

                                      const num = (el as NumberValue).value;
                                      if (num < 0 || num > 255 || !Number.isInteger(num))
                                      {
                                          throw_exception({
                                              type: "Runtime",
                                              message: `file::append expects bytes (0-255), got ${num} at index ${i}.`
                                          });
                                      }
                                      uint8[i] = num;
                                  }
                                  fs.appendFileSync(path, uint8);
                              }
                              else
                              {
                                  check_arg_type(content, RuntimeValueType.String, `file::append (${encoding} encoding)`);
                                  const str_content = (content as StringValue).value;
                                  fs.appendFileSync(path, str_content, encoding as BufferEncoding);
                              }
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