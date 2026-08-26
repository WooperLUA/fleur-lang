import {RuntimeValueType} from "@types";
import type {Environment} from "@runtime";
import {io} from "./src/io";
import {math} from "./src/math";
import {time} from "./src/time";
import {str} from "./src/str";
import {cast} from "./src/cast";
import {list} from "./src/list";
import {struct} from "./src/struct";
import {set} from "./src/set";

export const setup_stdlib = (env: Environment, args: string[] = []) =>
{
    const args_val = io.properties.get("args") as any;
    if (args_val)
    {
        args_val.elements = args.map(arg => ({type: RuntimeValueType.String, value: arg}));
    }

    env.declare("cast", cast, true);
    env.declare("io", io, true);
    env.declare("math", math, true);
    env.declare("str", str, true);
    env.declare("time", time, true);
    env.declare("list", list, true);
    env.declare("struct", struct, true);
    env.declare("set", set, true);
};
