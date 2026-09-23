import {RuntimeValueType} from "@types";
import {type Environment} from "@runtime";
import {io} from "./src/io";
import {math} from "./src/math";
import {time} from "./src/time";
import {str} from "./src/str";
import {type} from "./src/type.ts";
import {file} from "./src/file.ts";
import {os} from "./src/os.ts";
import {reflect} from "./src/reflect.ts";
import {regex} from "./src/regex.ts";
import {crypto} from "./src/crypto.ts";
import {json} from "./src/json.ts";
import {http} from "./src/http.ts";
import {test} from "./src/test.ts";

export const setup_stdlib = (env: Environment, args: string[] = []) =>
{
    const args_val = io.properties.get("args") as any;
    if (args_val)
    {
        args_val.elements = args.map(arg => ({type: RuntimeValueType.String, value: arg}));
    }

    env.declare("type", type, true);
    env.declare("io", io, true);
    env.declare("math", math, true);
    env.declare("str", str, true);
    env.declare("time", time, true);
    env.declare("file", file, true);
    env.declare("os", os, true);
    env.declare("reflect", reflect, true);
    env.declare("regex", regex, true);
    env.declare("crypto", crypto, true);
    env.declare("json", json, true);
    env.declare("http", http, true);
    env.declare("test", test, true);
};
