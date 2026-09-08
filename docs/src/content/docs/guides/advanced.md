---
title: Advanced Concepts
description: Deep Equality and internal details of fleur.
---

## Deep Equality

fleur performs deep equality checks for complex types like Arrays, Structs, Sets, and Maps when using `==` or methods like `contains()`.

This means that two different instances are considered equal if all their members are equal.

```flr
struct Point { x, y }
const p1 = Point { x: 1, y: 2 };
const p2 = Point { x: 1, y: 2 };

io::print(p1 == p2); // true
```

Deep equality is recursively applied, so nested structures are also compared by value.

If you ever need to compare by reference, use [**`reflect::is`**](/guides/stdlib/reflect/).

## Further Reading

- [Modules and Imports](../modules/)
- [Error Handling](../errors/)
- [Ranges](../ranges/)

