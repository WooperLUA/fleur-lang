import type {RuntimeValue} from "@types";
import {throw_exception} from "./exception";

export const check_args_length = (args: RuntimeValue[], expected: number, name: string): void =>
{
    if (args.length !== expected)
    {
        throw_exception({
            type:    "Runtime",
            message: `${name} expects exactly ${expected} argument${expected > 1 ? "s" : ""}.`
        });
    }
}
