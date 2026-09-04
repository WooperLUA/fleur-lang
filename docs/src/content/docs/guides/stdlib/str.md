---
title: String Module
description: Reference for the Lys str module.
---

String manipulation utilities. Note that these are static methods on the `str` module, not methods on string instances.

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `length(s)` | `Number` | Returns the number of characters in string `s`. |
| `trim(s)` | `String` | Removes whitespace from both ends of string `s`. |
| `upper(s)` | `String` | Returns a new string with all characters in `s` converted to uppercase. |
| `lower(s)` | `String` | Returns a new string with all characters in `s` converted to lowercase. |
| `contains(s, sub)` | `Boolean` | Returns `true` if `s` contains the substring `sub`. |
| `at(s, index)` | `String` | Returns the character at the specified `index` in string `s`. Supports negative indices. |

### Examples

```lys
const name = "  Lys Lang  ";
const trimmed = str::trim(name); // "Lys Lang"
const is_lys = str::contains(trimmed, "Lys"); // true
```
