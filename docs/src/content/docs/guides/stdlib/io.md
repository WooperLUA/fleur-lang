---
title: IO Module
description: Reference for the fleur io module.
---

The `io` module provides basic input and output functionality.

## Properties

| Member | Description |
| :--- | :--- |
| `args` | Command line arguments passed during the execution of the fleur script. |

## Methods

| Member            | Return Type  | Description                                                                                 |
|:------------------|:-------------|:--------------------------------------------------------------------------------------------|
| `print(...args)`  | `Null`       | Prints values to the standard output, separated by spaces and followed by a newline.        |
| `error(...args)`  | `Null`       | Prints values to the standard error output.                                                 |
| `read(prompt)`    | `String`     | Displays a `prompt` and reads a string input from the user (stdin).                         |
| `read_key()`      | `String`     | Reads a single keypress from stdin without waiting for Enter. Returns the key as a string.  |
| `clear()`         | `Null`       | Clears the terminal console.                                                                |

### Examples

```flr
io::print("Hello", "World");
const name = io::read("Enter your name: ");
```

