---
title: String Module
description: Reference for the fleur str module.
---

String manipulation utilities. Note that these are static methods on the `str` module, not methods on string instances as they are primitives.

## Methods

| Member                     | Return Type | Description                                                                                                                           |
|:---------------------------|:------------|:--------------------------------------------------------------------------------------------------------------------------------------|
| `length(s)`                | `Number`    | Returns the number of characters in string `s`.                                                                                       |
| `trim(s)`                  | `String`    | Removes whitespace from both ends of string `s`.                                                                                      |
| `upper(s)`                 | `String`    | Returns a new string with all characters in `s` converted to uppercase.                                                               |
| `lower(s)`                 | `String`    | Returns a new string with all characters in `s` converted to lowercase.                                                               |
| `contains(s, sub)`         | `Boolean`   | Returns `true` if `s` contains the substring `sub`.                                                                                   |
| `at(s, index)`             | `String`    | Returns the character at the specified `index` in string `s`. Supports negative indices.                                              |
| `slice(s, range)`          | `String`    | Returns a new string containing a portion of the original string defined by a `Range`.                                                |
| `join(separator, ...args)` | `String`    | Returns a new string containing all the arguments separed by the `separator`. You must at least pass 2 arguments after the seperator. |
| `unicode(s)`               | `Number`    | Returns the Unicode code point value of the string `s`. `s` must be of length 1 (a character).                                        | 
| `prefixed(s, prefix)`      | `Boolean`   | Returns `true` if `s` is prefixed with `prefix`.                                                                                      | 
| `suffixed(s, suffix)`      | `Boolean`   | Returns `true` if `s` is suffixed with `suffix`.                                                                                      | 

### Examples

```flr
const name = "  fleur Lang  ";
const trimmed = str::trim(name); // "fleur Lang"
const is_fleur = str::contains(trimmed, "fleur"); // true
```

