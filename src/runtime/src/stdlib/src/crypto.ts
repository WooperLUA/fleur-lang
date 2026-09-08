import { createHash, randomUUID } from "node:crypto";
import { RuntimeValueType, type StringValue } from "@types";
import { check_args_length, check_arg_type } from "@utils";
import type { RuntimeValue, NativeFunctionValue, StructValue } from "@types";

const hash_string = (algorithm: string, args: RuntimeValue[]): StringValue =>
{
    check_args_length(args, 1, `crypto::${algorithm}`);
    check_arg_type(args[0]!, RuntimeValueType.String, `crypto::${algorithm}`);

    const str = (args[0] as StringValue).value;
    const hex = createHash(algorithm).update(str).digest("hex");

    return { type: RuntimeValueType.String, value: hex };
};

export const crypto: StructValue =
    {
        type:       RuntimeValueType.Struct,
        identifier: "crypto",
        properties: new Map<string, RuntimeValue>(),
        methods:    new Map<string, any>([
            [
                "sha256",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (args: RuntimeValue[]) => hash_string("sha256", args)
                } as NativeFunctionValue
            ],
            [
                "sha512",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (args: RuntimeValue[]) => hash_string("sha512", args)
                } as NativeFunctionValue
            ],
            [
                "md5",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (args: RuntimeValue[]) => hash_string("md5", args)
                } as NativeFunctionValue
            ],
            [
                "uuid",
                {
                    type: RuntimeValueType.NativeFunction,
                    call: (_: RuntimeValue[]) =>
                          {
                              return { type: RuntimeValueType.String, value: randomUUID() };
                          }
                } as NativeFunctionValue
            ]
        ])
    };