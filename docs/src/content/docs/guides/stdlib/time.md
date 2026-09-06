---
title: Time Module
description: Reference for the fleur time module.
---

Time-related utilities.

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `now()` | `Number` | Returns the current timestamp in milliseconds. |
| `wait(ms)` | `Null` | Synchronously pauses execution for `ms` milliseconds. |

### Examples

```flr
const start = time::now();
time::wait(1000);
const end = time::now();
io::print("Elapsed: ", end - start, "ms");
```

