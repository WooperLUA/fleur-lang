---
title: Getting Started
description: Learn how to install and run Lys Lang.
---

Lys is a minimalistic scripting language designed for simplicity and educational purposes. It is built on top of the Bun runtime.

## Installation

### Building from source

To get started with building Lys, you need to have [Bun](https://bun.sh/) installed on your system.

1. Clone the repository:
   ```bash
   git clone <the link>
   cd lys-lang
   ```

2. Install dependencies:
   ```bash
   bun install
   ```
   
3. Build Lys to your target:
   ```bash
   bun run build-<your_plateform>
   ```
   
4. You can now get the lys runtime in the ./out dir (and optionally add it to you PATH).
   
### Getting the runtime from Releases

Download the runtime binaries from [Releases](link) (and optionally add it to you PATH).

## Running Lys

You can run Lys commands using the `lys` command followed by the name of the command.

### Execute a file

To execute a `.lys` file:

```bash
lys run path/to/your/file.lys
```

### REPL

Lys comes with an interactive REPL (Read-Eval-Print Loop):

```bash
lys repl
```

### Help

To see all available commands:

```bash
lys help
```

## Your First Script

Create a file named `hello.lys`:

```lys
func greet(name) 
{
    return "Hello, " + name + "!";
}

const message = greet("Lys");
io::print(message);
```

Run it:

```bash
lys run hello.lys
```

## IDE Support

(Work in progress)