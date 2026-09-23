---
title: Test Module
description: Reference for the fleur test module.
---

The `test` module provides basic assertions.

## Methods

| Member                    | Return Type | Description                                                                                          |
|:--------------------------|:------------|:-----------------------------------------------------------------------------------------------------|
| `assert(assertion, name)` | `Boolean`   | Returns `true` if `assertion` is `true` or throws an `Error` *(with the optional `name` parameter)*. |

### Examples

```flr
test::assert(true); // true
test::assert(1 > 2, "1 > 2") // Runtime : Assertion failed => "1 > 2"
```

