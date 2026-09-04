import type {ErrorValue, Exception, RuntimeValue} from "@types";
import {RuntimeValueType} from "@types";

export class LysError extends Error
{
    constructor(public value: RuntimeValue)
    {
        super((value as any).message || "Lys Runtime Error");
        this.name = "LysError";
    }
}

export const throw_exception = (err: Exception) =>
{
    const position = err.line && err.column ? `at ${err.line}:${err.column} ` : "";

    const formatted_message = `${err.type} ${position}: ${err.message}${err.metadata ? ` (${err.metadata})` : ""}`;

    const error_val: RuntimeValue = {
        type: RuntimeValueType.Error,
        message: formatted_message,
    };

    throw new LysError(error_val);
};