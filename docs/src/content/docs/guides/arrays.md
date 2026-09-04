---
title: Arrays
description: Working with Arrays in Lys.
---

Arrays (technically lists) are ordered, variable-sized collections that can hold multiple types.

## Creation

You can create arrays using literal syntax or the `Array::new` method.

```lys
const empty = [];
const numbers = [1, 2, 3];
const mixed = Array::new(1, "two", true);
```

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `Array::new(...args)` | `Array` | Creates a new array with optional initial `args`. |
| `Array::from(other)` | `Array` | Creates a new array from an existing Array or Set. |
| `add(value)` | `Array` | Appends an element to the end. Returns the array. |
| `insert(index, value)` | `Array` | Inserts an element at a specific index. Returns the array. |
| `get(index)` | `Any` | Returns the element at the index. |
| `set(index, value)` | `Array` | Sets the element at the index. Returns the array. |
| `length()` | `Number` | Returns the number of elements. |
| `pop()` | `Any` | Removes and returns the last element. |
| `at(index)` | `Any` | Returns the element at the specified `index`. Supports negative indices. |
| `contains(value)` | `Boolean` | Checks if a value exists (uses deep equality). |
| `remove_at(index)` | `Array` | Removes the element at the specified `index`. Returns the array. |
| `clear()` | `Array` | Removes all elements from the array. Returns the array. |
| `join(separator)` | `String` | Joins all elements into a string, separated by `separator`. |

## Bracket Syntax

You can also use bracket syntax to get and set values:

```lys
var list = [1, 2];
list::add(3);
io::print(list[0]); // 1
list[1] = 5;
```

:::note
Using `const` to declare an Array makes the Array itself **immutable**. You will not be able to use methods that modify the array (like `add`, `pop`, or `insert`) or use bracket assignment.
:::
