# Fleur Programming Language

Fleur is a minimalistic programming language designed for simplicity and educational purposes while remaining useful for real-world scripting. It features a full compiler pipeline, including a lexer, parser, and tree-walking interpreter, along with a growing standard library.

## Features

- **Educational & Practical**: Designed to be easy to learn and understand, yet powerful enough for useful scripts.
- **Control Flow**: `if`/`else`, `when` (pattern matching), `for`, and `while` loops.
- **Functions & Procedures**: Differentiate between pure functions (`func`) and side-effecting procedures (`proc`).
- **Data Structures**: Support for `structs`, `arrays`, and `maps`.
- **Error Handling**: Built-in `try`/`catch` mechanisms.
- **Module System**: Organize code with `import` and `pub` keywords.
- **REPL**: Interactive shell for quick prototyping.
- **Standard Library**: Built-in modules for IO, Time, Types, and more.

## Getting Started

### Installation

#### Building from source

To build Fleur from source, you need to have [Bun](https://bun.sh/) installed on your system.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/WooperLUA/fleur-lang
   cd fleur-lang
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Build Fleur for your platform:**
   Check `package.json` for available build scripts (e.g., `build-windows-x64`, `build-linux-x64`, `build-darwin-arm64`).
   ```bash
   bun run build-<your_platform>
   ```

4. **Access the runtime:**
   The compiled binary will be located in the `./out` directory. You can optionally add this directory to your `PATH` to use the `fleur` command globally.

#### Getting the runtime from Releases

Alternatively, you can download the pre-built runtime binaries from the [Releases](https://github.com/WooperLUA/fleur-lang/releases) page.

## Usage

If you have added the Fleur binary to your `PATH`, you can use the `fleur` command directly.

### Running a Script

To execute a `.flr` file:

```bash
fleur run path/to/your/script.flr
```

### Interactive REPL

Start the interactive shell:

```bash
fleur repl
```

### Help

Display available commands:

```bash
fleur help
```

## Example Code

Here is the proof Fleur is a real language :

```flr
io::print("Hello, Fleur (and also the world)");
```

Check the `exemple/` directory for more comprehensive examples of the language features.

## Libraries

Check the `libs/` directory for exemples of libraries built in Fleur by me, they can just be imported by downloading them and importing them with the import module system.

## Documentation

Explore the full language with the [documentation](https://wooperlua.github.io/fleur-lang/).

## License

This project is licensed under the [LICENSE](LICENSE) file included in the repository.
