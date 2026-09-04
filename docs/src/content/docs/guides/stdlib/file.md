---
title: File Module
description: Reference for the Lys file module.
---

File system operations.

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `read(path)` | `String` | Reads the entire content of the file at `path` as a string. |
| `write(path, content)` | `Null` | Writes `content` string to the file at `path`. Overwrites existing content. |
| `append(path, content)` | `Null` | Appends `content` string to the end of the file at `path`. |
| `exists(path)` | `Boolean` | Returns `true` if a file or directory exists at `path`. |
| `remove(path)` | `Null` | Deletes the file at `path`. |
| `join_path(...parts)` | `String` | Joins multiple path segments into a single path string. |

### Examples

```lys
const config_path = "config.json";
if file::exists(config_path) {
    const data = file::read(config_path);
    io::print(data);
}
```
