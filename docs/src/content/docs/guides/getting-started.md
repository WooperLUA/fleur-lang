---
title: Getting Started
description: Learn how to install and run Lys Lang.
---

Lys is a lightweight scripting language designed for simplicity and performance. It is built on top of Bun and TypeScript.

## Installation

To get started with Lys, you need to have [Bun](https://bun.sh/) installed on your system.

1. Clone the repository:
   ```bash
   git clone https://github.com/lys-lang/lys
   cd lys
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

## Running Lys

You can run Lys scripts using the `bun run index.ts` command or use the provided alias if you have it set up.

### Execute a file

To execute a `.lys` file:

```bash
bun run index.ts run path/to/your/file.lys
```

### REPL

Lys comes with an interactive REPL (Read-Eval-Print Loop):

```bash
bun run index.ts repl
```

### Help

To see all available commands:

```bash
bun run index.ts help
```

## Your First Script

Create a file named `hello.lys`:

```lys
func greet(name) {
    return "Hello, " + name + "!";
}

const message = greet("Lys");
io::print(message);
```

Run it:

```bash
bun run index.ts run hello.lys
```

## IDE Support

(Work in progress)