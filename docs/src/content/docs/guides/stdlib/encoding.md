---
title: Encoding Module
description: Reference for the fleur encoding module.
---

Encoding and decoding utilities.

## Properties

| Member      | Description                                                   |
|:------------|:--------------------------------------------------------------|
| `ascii`     | Returns the string `ascii`.                                   |
| `utf8`      | Returns the string `utf8`.                                    |
| `utf16le`   | Returns the string `utf16le`.                                 |
| `ucs2`      | Returns the string `ucs2`.                                    |
| `base64`    | Returns the string `base64`.                                  |
| `base64url` | Returns the string `base64url`.                               |
| `latin1`    | Returns the string `latin1`.                                  |
| `binary`    | Returns the string `binary`.                                  |
| `hex`       | Returns the string `hex`.                                     |




## Methods

| Member                    | Return Type     | Description                                                                            |
|:--------------------------|:----------------|:---------------------------------------------------------------------------------------|
| `from(value, encoding)`   | `String`        | Returns the value `value` to the encoding format `encoding`                            |
| `to(value, encoding)`     | `String`        | Returns the value `value` encoded in the format `encoding` to a standard utf8 `string` |

### Examples

```flr
const base64_value = encoding::to("value", encoding.base64);
io::print(base64_value); // "dmFsdWU="

const utf8_value = encoding::from(base64_value, encoding.base64);
io::print(utf8_value); // "value"
```

