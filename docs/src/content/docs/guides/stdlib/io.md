---
title: IO Module
description: Reference for the Lys io module.
---

The `io` module provides basic input and output functionality.

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `print(...args)` | `Null` | Prints values to the standard output, separated by spaces and followed by a newline. |
| `error(...args)` | `Null` | Prints values to the standard error output. |
| `read(prompt)` | `String` | Displays a `prompt` and reads a string input from the user (stdin). |
| `clear()` | `Null` | Clears the terminal console. |

### Examples

```lys
io::print("Hello", "World");
const name = io::read("Enter your name: ");
```
