---
title: OS Module
description: Reference for the fleur os module.
---

Operating system and process information.

## Properties

| Member     | Description                                                  |
|:-----------|:-------------------------------------------------------------|
| `platform` | Returns the OS platform string (e.g., `"win32"`, `"linux"`). |
| `homedir`  | Returns the path to the current user's home directory.       |
| `cwd`      | Returns the current working directory of the Fleur process.  |
| `env`      | Sub-struct of `os` related to environment variables.         |

## Methods

### `os`

| Member          | Return Type | Description                                                             |
|:----------------|:------------|:------------------------------------------------------------------------|
| `exit(code)`    | `Null`      | Exits the current process with the given `code`.                        |
| `exec(command)` | `String`    | Executes a shell `command` and returns its standard output as a string. |

### `os.env`

| Member          | Return Type        | Description                                                                |
|:----------------|:-------------------|:---------------------------------------------------------------------------|
| `get(key)`      | `String` or `Null` | Returns the value of the environment variable `key`, or `null` if not set. |
| `set(key, val)` | `Null`             | Sets the environment variable `key` to `val`.                              |

## Examples

```flr
io::print("Running on: " + os.platform);
io::print("Home directory: " + os.homedir);
io::print("Current directory: " + os.cwd);

const output = os::exec("echo Hello from shell");
io::print(output);

// Environment variables
const path = os.env::get("PATH");
if path != null {
    io::print("PATH is " + path);
}

os.env::set("MY_VAR", "hello");
io::print(os.env::get("MY_VAR")); // "hello"

