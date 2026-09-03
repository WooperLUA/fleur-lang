import type {Environment} from "@runtime";
import {array} from "./src/array.ts";
import {set} from "./src/set.ts";
import {map} from "./src/map.ts";


export const setup_data_structures = (env: Environment, args: string[] = []) =>
{
    env.declare("Array", array, true);
    env.declare("Set", set, true);
    env.declare("Map", map, true);
};
