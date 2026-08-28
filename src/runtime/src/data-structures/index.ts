import type {Environment} from "@runtime";
import {array} from "./src/array.ts";
import {set} from "./src/set.ts";
import {struct} from "./src/struct.ts";


export const setup_data_structures = (env: Environment, args: string[] = []) =>
{
    env.declare("Array", array, true);
    env.declare("Set", set, true);
    env.declare("Struct", struct, true);
};
