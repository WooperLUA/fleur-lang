import {FleurError, throw_exception} from "@utils";
import {tokenize, Parser, optimize_statement} from "@compiler";
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
                    message: "You must provide a .flr file."
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

                if (!(file?.name?.endsWith('.flr'))) return throw_exception({
                    type:    "InvalidArgument",
                    message: "You must provide a file with the '.flr' extension.",
                })

                let should_optimize = false;
                const fleur_args: string[] = [];

                for (let i = 2; i < args.length; i++)
                {
                    if (args[i] === '--optimize')
                    {
                        should_optimize = true;
                    }
                    else
                    {
                        fleur_args.push(args[i]!);
                    }
                }

                try
                {
                    const bytes = await file.text();
                    const tokens = tokenize(bytes);
                    const parser = new Parser(tokens);
                    const ast = parser.parse();

                    if (should_optimize)
                    {
                        ast.body = ast.body.map(stmt => optimize_statement(stmt));
                    }

                    const env = create_global_env(fleur_args, current_dir);
                    interpret(ast, env);
                }
                catch (e)
                {
                    if (e instanceof FleurError)
                    {
                        console.error(`\x1b[31m[fleur] -> ${(e.value as ErrorValue).message}\x1b[0m`);
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
                    {cmd: ['run', '[.flr file] [--optimize] [args...]', '  Executes a .flr file.'], color: YELLOW},
                    {cmd: ['repl', '', '\t      Runs a live REPL.'], color: CYAN},
                    {cmd: ['help', '', '\t      Displays all available commands.'], color: GREEN},
                ];

                console.log(`${GRAY}-----------------------------------------------------------------${RESET}`);
                console.log(`${BOLD}Commands:${RESET}\n`);

                for (const command of commands)
                {
                    const {cmd, color} = command;
                    const [name, arg, desc] = cmd;
                    console.log(`  ${color}${name!.padEnd(8)}${GRAY}${arg!.padEnd(24)}${RESET}${desc}`);
                }
                break;
            }
            default:
            {
                return throw_exception({
                    type:     'InvalidArgument',
                    message:  "Unknown command. Use fleur help to see all available commands.",
                    metadata: cmd
                })
            }
        }
    }
    catch (e: any)
    {
        if (e instanceof FleurError)
        {
            console.error(`\x1b[31m[fleur] -> ${(e.value as ErrorValue).message}\x1b[0m`);
        }
        else if (e.message)
        {
            console.error(e.message);
        }
    }
}

main()