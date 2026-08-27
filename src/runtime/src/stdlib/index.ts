import {RuntimeValueType} from "@types";
import type {Environment} from "@runtime";
import {io} from "./src/io";
import {math} from "./src/math";
import {time} from "./src/time";
import {str} from "./src/str";
import {type} from "./src/type.ts";
import {arrays} from "./src/arrays.ts";
import {structs} from "./src/structs.ts";
import {sets} from "./src/sets.ts";

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
    env.declare("arrays", arrays, true);
    env.declare("structs", structs, true);
    env.declare("sets", sets, true);
};
