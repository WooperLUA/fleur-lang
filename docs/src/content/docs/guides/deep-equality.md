---
title: Deep Equality
description: Deep Equality and internal details of fleur.
---

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


### Deep Immutability

When a variable is declared as `const` with an `Array` type, the immutability is deep, meaning elements within the array (and nested arrays) cannot be modified.

```flr
const matrix: Array = [[1, 2], [3, 4]];
// matrix[0][0] = 99; // Error: Caught expected error for mutating const matrix
```

