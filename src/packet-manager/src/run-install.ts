import {execSync} from "node:child_process";
import {existsSync, mkdirSync} from "node:fs";
import * as node_path from "node:path";
import {parse_project_config} from "@utils";

export const run_install = async () =>
{
    const [config, _] = await parse_project_config();
    const deps = config.dependencies || {};
    const dep_names = Object.keys(deps);

    if (dep_names.length === 0)
    {
        console.log("No dependencies to install.");
        return;
    }

    const deps_dir = node_path.join(process.cwd(), '.fleur_deps');
    if (!existsSync(deps_dir)) mkdirSync(deps_dir);

    console.log(`\x1b[36mInstalling ${dep_names.length} dependencies...\x1b[0m`);

    for (const name of dep_names)
    {
        const url = deps[name];
        const target_dir = node_path.join(deps_dir, name);

        if (existsSync(target_dir))
        {
            console.log(`\x1b[90mSkipping ${name} (already installed)\x1b[0m`);
            continue;
        }

        console.log(`\x1b[33mFetching ${name} from ${url}...\x1b[0m`);

        try
        {
            execSync(`git clone ${url} ${target_dir}`, { stdio: 'inherit' });
            console.log(`\x1b[32mSuccessfully installed ${name}\x1b[0m`);
        }
        catch (e)
        {
            console.error(`\x1b[31mFailed to install ${name}. Check the URL and your internet connection.\x1b[0m`);
        }
    }
};