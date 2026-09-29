import {
    RuntimeValueType,
    type StringValue,
} from "@types";
import {
    check_args_length,
    check_arg_type,
    throw_exception
} from "@utils";
import type {
    RuntimeValue,
    NativeFunctionValue,
    StructValue,
} from "@types";

export const encoding: StructValue = {
    type:       RuntimeValueType.Struct,
    identifier: "encoding",
    properties: new Map<string, RuntimeValue>([
        ["ascii",     { type: RuntimeValueType.String, value: "ascii" }],
        ["utf8",      { type: RuntimeValueType.String, value: "utf8" }],
        ["utf16le",   { type: RuntimeValueType.String, value: "utf16le" }],
        ["ucs2",      { type: RuntimeValueType.String, value: "ucs2" }],
        ["base64",    { type: RuntimeValueType.String, value: "base64" }],
        ["base64url", { type: RuntimeValueType.String, value: "base64url" }],
        ["latin1",    { type: RuntimeValueType.String, value: "latin1" }],
        ["binary",    { type: RuntimeValueType.String, value: "binary" }],
        ["hex",       { type: RuntimeValueType.String, value: "hex" }],
    ]),
    methods:    new Map<string, any>([
        [
            "from",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "encoding::from");
                          check_arg_type(args[0]!, RuntimeValueType.String, "encoding::from");
                          check_arg_type(args[1]!, RuntimeValueType.String, "encoding::from");

                          const value = (args[0]! as StringValue).value;
                          const encoding = (args[1]! as StringValue).value;

                          try
                          {
                              const result = Buffer.from(value, encoding as BufferEncoding).toString("utf8");
                              return { type: RuntimeValueType.String, value: result } as StringValue;
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Failed to decode string from '${encoding}'. Ensure the string is valid.`
                              });
                              return { type: RuntimeValueType.Null, value: null };
                          }
                      },
            } as NativeFunctionValue,
        ],
        [
            "to",
            {
                type: RuntimeValueType.NativeFunction,
                call: (args: RuntimeValue[]) =>
                      {
                          check_args_length(args, 2, "encoding::to");
                          check_arg_type(args[0]!, RuntimeValueType.String, "encoding::to");
                          check_arg_type(args[1]!, RuntimeValueType.String, "encoding::to");

                          const value = (args[0]! as StringValue).value;
                          const encoding = (args[1]! as StringValue).value;

                          try
                          {
                              const result = Buffer.from(value).toString(encoding as BufferEncoding);
                              return { type: RuntimeValueType.String, value: result } as StringValue;
                          }
                          catch (e: any)
                          {
                              throw_exception({
                                  type:    "Runtime",
                                  message: `Invalid encoding '${encoding}'.`
                              });
                              return { type: RuntimeValueType.Null, value: null };
                          }
                      },
            } as NativeFunctionValue,
        ],
    ]),
};