import type {RuntimeValue} from "@types";
import {throw_exception} from "./exception";

export const check_args_length = (args: RuntimeValue[], expected: number | number[], name: string): void =>
{
    const expectations = Array.isArray(expected) ? expected : [expected];
    if (!expectations.includes(args.length))
    {
        throw_exception({
            type:    "Runtime",
            message: `${name} expects exactly ${expectations.join(' or ')} argument(s)}.`
        });
    }
}
