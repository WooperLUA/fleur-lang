---
title: OS Module
description: Reference for the Lys os module.
---

Operating system and process information.

## Properties

| Member | Description |
| :--- | :--- |
| `platform` | Returns the OS platform string (e.g., `"win32"`, `"linux"`). |
| `homedir` | Returns the path to the current user's home directory. |

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `env(key)` | `String` or `Null` | Returns the value of the environment variable `key`, or `null` if not set. |
| `set_env(key, val)` | `Null` | Sets the environment variable `key` to `val`. |
| `exit(code)` | (None) | Exits the current process with the given `code`. |
| `exec(command)` | `String` | Executes a shell `command` and returns its standard output as a string. |

### Examples

```lys
io::print("Running on: ", os.platform);
const user_home = os.homedir;
```
