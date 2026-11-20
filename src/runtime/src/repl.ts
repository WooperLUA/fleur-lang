import {tokenize, Parser} from "@compiler";
import {interpret, create_global_env} from "./interpreter";
import {FleurError, format_pretty_error, stringify_value} from "@utils";
import {type ErrorValue, RuntimeValueType} from "@types";
import * as node_path from "node:path";

const print_exception = (e: any) =>
{
    if (e instanceof FleurError)
    {
        console.error(format_pretty_error(e.value as ErrorValue));
    }
    else if (e?.message)
    {
        console.error(e.message);
    }
    else
    {
        console.error(e);
    }
};

export const start_repl = async (file: Bun.BunFile | null, aliases: Record<string, string> = {}) =>
{
    const file_path = file?.name ? node_path.resolve(file.name) : null;
    const base_dir = file_path ? node_path.dirname(file_path) : process.cwd();
    const env = create_global_env([], base_dir, aliases);

    console.clear();
    console.log("\x1b[33m\x1b[1mFleur REPL\x1b[0m");
    console.log("\x1b[90mType 'exit' or press Ctrl+C to quit.\x1b[0m");
    if (file && file_path)
    {
        try
        {
            const source = await file.text();
            const tokens = tokenize(source);
            const parser = new Parser(tokens);
            const ast = parser.parse();

            // Let runtime errors point at the loaded file while it executes.
            env.source = source;
            env.file = file_path;
            interpret(ast, env);

            console.log(`\x1b[36m'${file_path}'\x1b[0m loaded in REPL.`);
        }
        catch (e: any)
        {
            console.error(`\x1b[31m[fleur] -> Failed to load '${file_path}':\x1b[0m`);
            print_exception(e);
        }
        finally
        {
            // REPL input should not be reported as if it came from the loaded file.
            env.source = undefined;
            env.file = undefined;
        }
    }

    while (true)
    {
        const input = prompt("\x1b[36m[fleur] >\x1b[0m ");

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
            print_exception(e);
        }
    }
};