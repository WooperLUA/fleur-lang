import {tokenize, Parser} from "@compiler";
import {interpret, create_global_env} from "./interpreter";
import {FleurError, format_pretty_error, stringify_value} from "@utils";
import {type ErrorValue, RuntimeValueType} from "@types";
import * as node_path from "node:path";
import * as node_fs from "node:fs";
import * as node_readline from "node:readline";

const print_exception = (e: any, source?: string, file?: string) =>
{
    if (e instanceof FleurError)
    {
        const error = e.value as ErrorValue;
        if (error.line !== undefined && error.column !== undefined)
        {
            error.source ??= source;
            error.file ??= file;
        }
        console.error(format_pretty_error(error));
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
    let env = create_global_env([], base_dir, aliases);

    console.clear();
    console.log("\x1b[33m\x1b[1mFleur REPL\x1b[0m");
    console.log("\x1b[90mType 'exit' or press Ctrl+C to quit.\x1b[0m");

    const load_file = async (target_env: typeof env, action: "load" | "reload"): Promise<boolean> =>
    {
        if (!file_path) return false;

        let source = "";
        try
        {
            source = await Bun.file(file_path).text();
            const tokens = tokenize(source);
            const parser = new Parser(tokens);
            const ast = parser.parse();

            // Let runtime errors point at the loaded file while it executes.
            target_env.source = source;
            target_env.file = file_path;
            interpret(ast, target_env);

            const verb = action === "load" ? "loaded in REPL" : "reloaded";
            console.log(`\x1b[36m'${file_path}'\x1b[0m ${verb}.`);
            return true;
        }
        catch (e: any)
        {
            console.error(`\x1b[31m[fleur] -> Failed to ${action} '${file_path}':\x1b[0m`);
            print_exception(e, source, file_path);
            return false;
        }
        finally
        {
            // REPL input should not be reported as if it came from the loaded file.
            target_env.source = undefined;
            target_env.file = undefined;
        }
    };

    if (file && file_path)
    {
        await load_file(env, "load");
    }

    const rl = node_readline.createInterface({
        input:  process.stdin,
        output: process.stdout
    });
    rl.setPrompt("\x1b[36m[fleur] >\x1b[0m ");

    const prompt = () => rl.prompt(true);

    let reload_timer: ReturnType<typeof setTimeout> | undefined;
    let reloading = false;
    let reload_again = false;

    const schedule_reload = () =>
    {
        if (reload_timer) clearTimeout(reload_timer);

        reload_timer = setTimeout(() =>
        {
            reload_timer = undefined;
            void reload_file();
        }, 100);
    };

    const reload_file = async () =>
    {
        if (!file_path) return;

        if (reloading)
        {
            reload_again = true;
            return;
        }

        reloading = true;
        try
        {
            // Rebuild the environment so redeclarations in the edited file don't clash
            // with the previous version of the file.
            const next_env = create_global_env([], base_dir, aliases);
            if (await load_file(next_env, "reload"))
            {
                env = next_env;
            }
        }
        finally
        {
            reloading = false;
            prompt();

            if (reload_again)
            {
                reload_again = false;
                schedule_reload();
            }
        }
    };

    if (file_path)
    {
        node_fs.watchFile(file_path, {interval: 100}, (current, previous) =>
        {
            if (current.mtimeMs === previous.mtimeMs && current.size === previous.size)
            {
                return;
            }

            schedule_reload();
        });
    }

    rl.on("SIGINT", () =>
    {
        rl.close();
    });

    try
    {
        prompt();

        for await (const input of rl)
        {
            const line = input.trim();

            if (line === "exit")
            {
                rl.close();
                break;
            }

            if (line === "")
            {
                prompt();
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
                print_exception(e, line);
            }

            prompt();
        }
    }
    finally
    {
        if (file_path)
        {
            node_fs.unwatchFile(file_path);
        }

        if (reload_timer)
        {
            clearTimeout(reload_timer);
        }

        rl.close();
    }
};
