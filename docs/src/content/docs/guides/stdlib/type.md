---
title: Type Module
description: Reference for the fleur type module.
---

Type checking and explicit conversion.

## Methods

| Member           | Return Type | Description                                                                                       |
|:-----------------|:------------|:--------------------------------------------------------------------------------------------------|
| `of(value)`      | `String`    | Returns the internal type name of the `value` as a string (e.g., `"Number"`, `"Array"`).          |
| `number(value)`  | `Number`    | Converts `value` to a number. Returns `0` if conversion fails.                                    |
| `string(value)`  | `String`    | Converts `value` to its string representation.                                                    |
| `boolean(value)` | `Boolean`   | Converts `value` to a boolean.                                                                    |

### Examples

```flr
const val = 123;
io::print(type::of(val)); // "Number"

const str_val = "456";
const num_val = type::number(str_val); // 456
```

