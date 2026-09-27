import type {ErrorValue, Exception, RuntimeValue} from "@types";
import {RuntimeValueType} from "@types";

export class FleurError extends Error
{
    constructor(public value: RuntimeValue)
    {
        super((value as any).message || "Fleur Runtime Error");
        this.name = "FleurError";
    }
}

export const throw_exception = (err: Exception) =>
{
    const error_val: ErrorValue = {
        type:     RuntimeValueType.Error,
        error_type: err.type,
        message:  err.message,
        metadata: err.metadata,
        line:     err.line,
        column:   err.column
    };
    throw new FleurError(error_val);
};

export const format_pretty_error = (err: ErrorValue): string =>
{
    const RESET = "\x1b[0m";
    const RED = "\x1b[31m";
    const BOLD = "\x1b[1m";
    const GRAY = "\x1b[90m";

    // 1. Header: Use the preserved error_type, fallback to "Runtime"
    const errorType = err.error_type === "Error" ? "Runtime" : (err.error_type || "Runtime");
    let output = `${BOLD}${RED}LysError [${errorType}]${RESET}${BOLD} : ${err.message}${RESET}\n`;

    // 2. Visual Source Code Snippet
    if (err.source && err.line && err.column)
    {
        const lines = err.source.split('\n');
        const targetLineIdx = err.line - 1;

        // Context window: 1 line before, 1 line after (keeps it compact)
        const startLine = Math.max(0, targetLineIdx - 1);
        const endLine = Math.min(lines.length - 1, targetLineIdx + 1);

        // Calculate padding for line numbers so the "|" aligns perfectly
        const maxLineNum = endLine + 1;
        const padding = maxLineNum.toString().length;

        const filePath = err.file || 'source';
        output += `${GRAY}  --> ${filePath}:${err.line}:${err.column}${RESET}\n`;

        // Top gutter: perfectly aligned "|"
        output += `${GRAY}${" ".repeat(padding)} |${RESET}\n`;

        for (let i = startLine; i <= endLine; i++)
        {
            const lineNumStr = (i + 1).toString().padStart(padding, ' ');
            const lineContent = lines[i] || "";
            const isTarget = i === targetLineIdx;

            if (isTarget)
            {
                // Highlight the offending line in red
                output += `${RED}${BOLD}${lineNumStr} | ${RESET}${lineContent}\n`;

                // Draw a squiggly pointer starting at the error column
                const col = Math.max(1, err.column);
                const pointerPad = " ".repeat(col - 1);

                // Use "~~~" to indicate the general area of the error.
                // This is much more forgiving than a single "^" when we only have the start column.
                const squiggle = "~~~";
                const metadata = err.metadata ? ` ${err.metadata}` : "";

                output += `${GRAY}${" ".repeat(padding)} | ${RESET}${pointerPad}${RED}${BOLD}${squiggle}${RESET}${metadata}\n`;
            }
            else
            {
                // Normal context lines in gray
                output += `${GRAY}${lineNumStr} | ${RESET}${lineContent}\n`;
            }
        }
        // Bottom gutter: perfectly aligned "|"
        output += `${GRAY}${" ".repeat(padding)} |${RESET}\n`;
    }
    else
    {
        // Fallback if no source code is available (e.g., REPL or internal error)
        const metadata = err.metadata ? ` (${err.metadata})` : "";
        output += `${GRAY}note: ${err.message}${metadata}${RESET}\n`;
    }

    return output;
};