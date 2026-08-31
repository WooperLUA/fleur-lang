import {tokenize, Parser} from "@compiler";
import {interpret, create_global_env} from "./interpreter";
import {LysError, stringify_value} from "@utils";
import {type ErrorValue, RuntimeValueType} from "@types";

export const start_repl = () =>
{
    const env = create_global_env();
    console.clear();
    console.log("\x1b[33m\x1b[1mLys REPL\x1b[0m");
    console.log("\x1b[90mType 'exit' or press Ctrl+C to quit.\x1b[0m");

    while (true)
    {
        const input = prompt("\x1b[36m[lys] >\x1b[0m ");

        if (input === null || input.trim() === "exit")
        {
            process.exit(0);
        }

        const line = input.trim();
        if (line === "")
        {
            continue;
        }

        try
        {
            const tokens = tokenize(line);
            const parser = new Parser(tokens);
            const ast = parser.parse();
            const result = interpret(ast, env);

            if (result && result.type !== RuntimeValueType.Null)
            {
                console.log(stringify_value(result));
            }
        }
        catch (e: any)
        {
            if (e instanceof LysError)
            {
                console.error(`\x1b[31m[lys] -> ${(e.value as ErrorValue).message}\x1b[0m`);
            }
            else if (e.message)
            {
                console.error(e.message);
            }
        }
    }
};