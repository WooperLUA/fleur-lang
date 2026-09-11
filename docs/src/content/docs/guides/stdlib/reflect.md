---
title: Reflect Module
description: Reference for the fleur reflect module.
---

Metaprogramming and introspection for Structs.

## Methods

| Member | Return Type | Description                                                                               |
| :--- | :--- |:------------------------------------------------------------------------------------------|
| `has(struct, key)` | `Boolean` | Returns `true` if the `struct` instance has a property named `key`.                       |
| `get(struct, key)` | `Any`,`Null` | Returns the value of the property `key` from the `struct` instance *or `null` if absent*. |
| `set(struct, key, val)` | `Null` | Sets the property `key` of the `struct` instance to `val`.                                |
| `remove(struct, key)` | `Boolean` | Deletes the property `key` from the `struct` instance. Returns `true` if successful.      |
| `identifier(struct)` | `String` | Returns the name of the Struct definition used to create the instance.                    |
| `is(a, b)` | `Boolean` | Returns `true` if `a` and `b` are the exact same object in memory (reference equality).   |

### Examples

```flr
struct Point { x, y }
const p = Point { x: 1, y: 2 };

io::print(reflect::identifier(p)); // "Point"
io::print(reflect::has(p, "x"));   // true
```

