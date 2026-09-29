---
title: File Module
description: Reference for the fleur file module.
---

File system operations.

## Methods

| Member                             | Return Type             | Description                                                                                                       |
|:-----------------------------------|:------------------------|:------------------------------------------------------------------------------------------------------------------|
| `read(path, encoding?)`            | `String` or `Array`     | Reads the bytes of the file as the `encoding` *(defaults to utf-8)* format at `path`.                             |
| `write(path, bytes, encoding?)`    | `Null`                  | Writes `bytes` as the `encoding` *(defaults to utf-8)* format to the file at `path`. Overwrites existing content. |
| `append(path, bytes, encoding?)`   | `Null`                  | Appends `bytes` as the `encoding` *(defaults to utf-8)* format to the end of the file at `path`.                  |
| `exists(path)`                     | `Boolean`               | Returns `true` if a file or directory exists at `path`.                                                           |
| `remove(path)`                     | `Null`                  | Deletes the file at `path`.                                                                                       |
| `join_path(...parts)`              | `String`                | Joins multiple path segments into a single path string.                                                           |

### Examples

```flr
const config_path = "config.json";
if file::exists(config_path) {
    const data: String = file::read(config_path); // defaults to utf-8 (the content of the file)
    io::print(data);
}

const image_path = "image.png";
if file::exists(image_path) {
    const data: Array = file::read(config_path, "bytes"); // "bytes" returns an array of bytes
    io::print(data); 
}
```

