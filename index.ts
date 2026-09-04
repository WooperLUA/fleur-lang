import {LysError, throw_exception} from "@utils";
import {tokenize, Parser} from "@compiler";
import {interpret, create_global_env, start_repl} from "@runtime";
import {type ErrorValue} from "@types";
import * as node_path from "node:path";

const main = async () =>
{
    const cmd = Bun.argv[2]
    const args = Bun.argv.slice(2)
    try
    {
        switch (cmd)
        {
            case 'run':
            {
                if (!args[1]) return throw_exception({
                    type:    "MissingArgument",
                    message: "You must provide a .lys file."
                })

                const path = args[1];
                const absolute_path = node_path.resolve(path);
                const current_dir = node_path.dirname(absolute_path);
                const file = Bun.file(path);

                if (!await file.exists()) return throw_exception({
                    type:     "InvalidArgument",
                    message:  "Invalid file path.",
                    metadata: `\"${path}\"`
                })

                if (!(file?.name?.endsWith('.lys'))) return throw_exception({
                    type:    "InvalidArgument",
                    message: "You must provide a file with the '.lys' extension.",
                })

                try
                {
                    const bytes = await file.text();
                    const tokens = tokenize(bytes);
                    const parser = new Parser(tokens);
                    const ast = parser.parse();
                    const env = create_global_env(args.slice(2), current_dir);
                    interpret(ast, env);
                }
                catch (e)
                {
                    if (e instanceof LysError)
                    {
                        console.error(`\x1b[31m[lys] -> ${(e.value as ErrorValue).message}\x1b[0m`);
                        process.exit(1);
                    }
                    else
                    {
                        console.error(e);
                        process.exit(1);
                    }
                }
                break;
            }
            case 'repl':
            {
                start_repl();
                break;
            }
            case 'help':
            {
                const RESET = '\x1b[0m';
                const YELLOW = '\x1b[33m'
                const GREEN = '\x1b[32m'
                const CYAN = '\x1b[36m';
                const GRAY = '\x1b[90m';
                const BOLD = '\x1b[1m';

                const commands = [
                    {cmd: ['run', '[.lys file] [arg1, arg2..]', '  Executes a .lys file.'], color: YELLOW},
                    {cmd: ['repl', '', '\t      Runs a live REPL.'], color: CYAN},
                    {cmd: ['help', '', '\t      Displays all available commands.'], color: GREEN},
                ];

                console.log(`${GRAY}-----------------------------------------------------------------${RESET}`);
                console.log(`${BOLD}Commands:${RESET}\n`);

                for (const command of commands)
                {
                    const {cmd, color} = command;
                    const [name, arg, desc] = cmd;
                    console.log(`  ${color}${name!.padEnd(8)}${GRAY}${arg!.padEnd(14)}${RESET}${desc}`);
                }
                break;
            }
            default:
            {
                return throw_exception({
                    type:     'InvalidArgument',
                    message:  "Unknown command. Use lys help to see all available commands.",
                    metadata: cmd
                })
            }
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

main()