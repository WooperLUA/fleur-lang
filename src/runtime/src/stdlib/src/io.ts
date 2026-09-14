import {
    RuntimeValueType, type StringValue,
} from "@types";
import {
    throw_exception,
    check_args_length,
    check_arg_type, stringify_value
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
} from "@types";

import * as node_fs from "node:fs";

export const io: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "io",
    properties: new Map<string, RuntimeValue>([
        [
            "args",
            {
                type:     RuntimeValueType.Array,
                elements: []
            }
        ],
    ]),
    methods:    new Map<string, any>([
        [
            "print",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          console.log(...args.map(a => stringify_value(a)));
                          return {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "error",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          console.error(...args.map(a => stringify_value(a)));
                          return {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "clear",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 0, "clear");
                          console.clear()
                          return {type: RuntimeValueType.Null, value: null};
                      },
            } as NativeFunctionValue,
        ],
        [
            "read",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 1, "io::read");
                          check_arg_type(args[0]!, RuntimeValueType.String, "io::read");

                          const value = (args[0] as StringValue).value

                          return {
                              type:  RuntimeValueType.String,
                              value: prompt(value ?? "") ?? ""
                          };
                      },
            } as NativeFunctionValue,
        ],
        [
            "read_key",
            {
                type: RuntimeValueType.NativeFunction,
                call: (_: RuntimeValue[]) =>
                      {
                          try
                          {
                              process.stdin.setRawMode(true);
                              process.stdin.resume();
                              process.stdin.setEncoding("utf8");

                              const buf = Buffer.alloc(4);
                              const bytesRead = node_fs.readSync(0, buf, 0, 4, null);

                              process.stdin.setRawMode(false);
                              process.stdin.pause();

                              const raw_key = buf.toString("utf8", 0, bytesRead);

                              const key_map: Record<string, string> = {
                                  "\r":     "ENTER",
                                  "\n":     "ENTER",
                                  " ":      "SPACE",
                                  "\t":     "TAB",
                                  "\x7F":   "BACKSPACE",
                                  "\x08":   "BACKSPACE",
                                  "\x1B":   "ESCAPE",
                                  "\x03":   "CTRL_C",
                                  "\x1B[A": "UP",
                                  "\x1B[B": "DOWN",
                                  "\x1B[C": "RIGHT",
                                  "\x1B[D": "LEFT",
                              };

                              // If the key is in our map, return the readable name.
                              // Otherwise, just return the raw character (like "a", "b", "1").
                              const readable_key = key_map[raw_key] ?? raw_key.toUpperCase();

                              return {
                                  type:  RuntimeValueType.String,
                                  value: readable_key
                              } as StringValue;
                          }
                          catch (e)
                          {
                              return {
                                  type:  RuntimeValueType.String,
                                  value: ""
                              } as StringValue;
                          }
                      },
            } as NativeFunctionValue,
        ],
    ]),
};


