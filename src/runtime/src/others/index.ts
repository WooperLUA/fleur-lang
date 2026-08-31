import {error} from './src/error'
import type {Environment} from "@runtime";

export const setup_other_structs = (env: Environment, args: string[] = []) =>
{

    env.declare("Error", error, true);
};
