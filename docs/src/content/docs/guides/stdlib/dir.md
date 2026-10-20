---
title: Dir Module
description: Reference for the fleur dir module.
---

Directory system operations.

## Methods

| Member                           | Return Type | Description                                                                         |
|:---------------------------------|:------------|:------------------------------------------------------------------------------------|
| `read(path)`                     | `Array`     | Returns an array of all the file's paths present in the directory at `path`.        |
| `make(path)`                     | `Null`      | Creates a directory at `path`.                                                      |
| `exists(path)`                   | `Boolean`   | Returns `true` if a directory exists at `path`.                                     |
| `remove(path)`                   | `Null`      | Removes the directory at `path`.                                                    |
| `join_path(...parts)`            | `String`    | Joins multiple path segments into a single path string *(same as file::join_path)*. |
| `rename(old_path, new_path) `    | `Null`      | Renames the directory at `old_path` to `new_path`.                                  |

### Examples

```flr
const src_path = ".\src\";
if dir::exists(src_path) {
    const files: Array = dir::read(src_path);
    io::print(files);
}
```

