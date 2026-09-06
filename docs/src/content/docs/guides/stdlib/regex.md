---
title: Regex Module
description: Reference for the fleur regex module.
---

Regular expression utilities.

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `test(pattern, s, [flags])` | `Boolean` | Returns `true` if the `pattern` matches anywhere in string `s`. |
| `match(pattern, s, [flags])` | `Array`,`Null` | Returns an Array of matches found in string `s` using the `pattern` *or `null` if no match*. |

### Examples

```flr
const is_valid = regex::test("^[a-z]+$", "hello"); // true
const matches = regex::match("\\d+", "abc 123 def 456"); // ["123", "456"]
```

