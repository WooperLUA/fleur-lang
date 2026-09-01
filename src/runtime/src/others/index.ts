import {error} from './src/error'
import type {Environment} from "@runtime";
import {range} from "./src/range.ts";

export const setup_other_structs = (env: Environment, args: string[] = []) =>
{

    env.declare("Error", error, true);
    env.declare("Range", range, true);
};
