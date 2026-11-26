---
title: Getting Started
description: Learn how to install and run fleur.
---

fleur is a minimalistic scripting language designed for simplicity and educational purposes. It is built on top of the Bun runtime.

## Installation

### Building from Source

To build fleur, you need [Bun](https://bun.sh/) and Git installed on your system.

1. Clone the repository:

   ```bash
   git clone https://github.com/WooperLUA/fleur-lang
   cd fleur-lang
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Build fleur for your platform. The available scripts are `build-windows-x64`, `build-windows-arm64`, `build-linux-x64`, `build-linux-arm64`, `build-darwin-x64`, and `build-darwin-arm64`:

   ```bash
   bun run build-linux-x64
   ```

4. The compiled binary is written to the `./out` directory. You can optionally add that directory to your `PATH` to run `fleur` from anywhere.

### Prebuilt Binaries

Prebuilt binaries are also available on the [Releases](https://github.com/WooperLUA/fleur-lang/releases) page. Download the binary for your platform and optionally add it to your `PATH`. Bun is not required to use a prebuilt binary.

## Quick Start

Create a file named `hello.flr`:

```flr
func greet(name)
{
    return "Hello, " + name + "!";
}

const message = greet("fleur");
io::print(message);
```

Run it with:

```bash
fleur run hello.flr
```

You should see:

```text
Hello, fleur!
```

## Usage

All fleur commands follow the pattern `fleur <command> [arguments]`. Run `fleur help` to list the available commands.

### Running a Script

To execute a `.flr` file:

```bash
fleur run path/to/your/file.flr
```

#### Script Arguments

You can pass arguments to your script. They are available as an array of strings in `io.args` (see [io](/fleur-lang/guides/stdlib/io/)):

```bash
fleur run path/to/your/file.flr arg1 arg2
```

```flr
io::print(io.args);
```

#### Optimization

Use the `--optimize` flag to apply AST optimisations before running the script (around 15% performance gain):

```bash
fleur run path/to/your/file.flr --optimize
```

#### AST

Use the `--ast` flag to show the program's AST:

```bash
fleur run path/to/your/file.flr --ast
```

### Packages

fleur includes a Git-based package manager. Initialize it in your project directory, then add dependencies:

```bash
fleur pkg init
fleur pkg add https://github.com/username/my-package.git
```

See the [Packet Manager](/fleur-lang/guides/packet-manager/) guide for the full workflow, including `fleur.json` aliases.

### Interactive REPL

fleur comes with an interactive REPL (Read-Eval-Print Loop):

```bash
fleur repl
```

Type `exit` or press Ctrl+C to quit. Expressions and declarations entered at the prompt must end with a semicolon:

```text
[fleur] > 1 + 1;
2
```

#### Preloading a File

You can preload a file into the REPL session. The file is executed before the first prompt appears, so its functions, constants and other definitions are available in the session:

```bash
fleur repl path/to/your/file.flr
```

Imports are resolved relative to the loaded file, and aliases from a nearby `fleur.json` are applied. If the file fails to run, the error is printed and the REPL still starts, so you can inspect the session or keep working.

## Next Steps

- [Language Basics](/fleur-lang/guides/basics/)
- [Control Flow](/fleur-lang/guides/control-flow/)
- [Functions & Procedures](/fleur-lang/guides/functions/)
- [Modules & Imports](/fleur-lang/guides/modules/)
- [Packet Manager](/fleur-lang/guides/packet-manager/)
- [Standard Library](/fleur-lang/guides/stdlib/)
