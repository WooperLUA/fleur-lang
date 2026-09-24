import {execSync} from "node:child_process";
import {existsSync, mkdirSync} from "node:fs";
import * as node_path from "node:path";

export const run_install = async () =>
{
    const config_path = node_path.join(process.cwd(), 'fleur.json');
    const file = Bun.file(config_path);

    if (!await file.exists())
    {
        console.error("\x1b[31m[fleur] -> fleur.json not found. Run 'fleur pkg init' first.\x1b[0m");
        process.exit(1);
    }

    const config = JSON.parse(await file.text());
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