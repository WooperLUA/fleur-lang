import type {Environment} from "@runtime";
import {array} from "./src/array.ts";
import {set} from "./src/set.ts";


export const setup_data_structures = (env: Environment, args: string[] = []) =>
{
    env.declare("Array", array, true);
    env.declare("Set", set, true);
};
