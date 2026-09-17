---
title: Getting Started
description: Learn how to install and run fleur.
---

fleur is a minimalistic scripting language designed for simplicity and educational purposes. It is built on top of the Bun runtime.

## Installation

### Building from source

To get started with building fleur, you need to have [Bun](https://bun.sh/) installed on your system.

1. Clone the repository:
   ```bash
   git clone https://github.com/WooperLUA/fleur-lang
   cd fleur-lang
   ```

2. Install dependencies:
   ```bash
   bun install
   ```
   
3. Build fleur to your target:
   ```bash
   bun run build-<your_plateform>
   ```
   
4. You can now get the fleur runtime in the ./out dir (and optionally add it to you PATH).
   
### Getting the runtime from Releases

Download the runtime binaries from [Releases](link) (and optionally add it to you PATH).

## Running fleur

You can run fleur commands using the `fleur` command followed by the name of the command.

### Execute a file

To execute a `.flr` file:

```bash
fleur run path/to/your/file.flr 
```

You can also use the following flags : 
 - `optimize` : AST optimisation (~= 15% performance gain)

```bash
fleur run path/to/your/file.flr --optimize
```

To pass arguments into your fleur script (see [io](./stdlib/io/)):
```bash
fleur run path/to/your/file.flr arg1 arg2
```


### REPL

fleur comes with an interactive REPL (Read-Eval-Print Loop):

```bash
fleur repl
```

### Help

To see all available commands:

```bash
fleur help
```

## Your First Script

Create a file named `hello.flr`:

```flr
func greet(name) 
{
    return "Hello, " + name + "!";
}

const message = greet("fleur");
io::print(message);
```

Run it:

```bash
fleur run hello.flr
```

## IDE Support

(Work in progress)
