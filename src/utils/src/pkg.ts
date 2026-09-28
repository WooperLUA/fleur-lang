import node_path from "node:path";

export const parse_project_config = async () =>
{
    const config_path = node_path.join(process.cwd(), 'fleur.json');
    const file = Bun.file(config_path);

    if (!await file.exists())
    {
        console.error("\x1b[31m[fleur] -> Local fleur.json not found. Run 'fleur pkg init' first.\x1b[0m");
        process.exit(1);
    }

    return [JSON.parse(await file.text()), config_path];
}