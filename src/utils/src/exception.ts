import type {Exception} from "@types";

export const throw_exception = (err: Exception<unknown>) =>
{
    const position = err.line && err.column ? ` at ${err.line}:${err.column}` : "";
    console.error(`[lys] -> ${err.type}${position} : ${err.message}${err.metadata ? ` (${err.metadata})` : ""}`);
    process.exit(1);
};