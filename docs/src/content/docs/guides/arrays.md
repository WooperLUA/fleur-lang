---
title: Arrays
description: Working with Arrays in fleur.
---

Arrays (technically lists) are ordered, variable-sized collections that can hold multiple types.

## Creation

You can create arrays using literal syntax or the `Array::new` method.

:::note
Using `const` to declare an Array makes the Array itself **immutable**. You will not be able to use methods that modify the array (like `add`, `pop`, or `insert`) or use bracket assignment.
:::

```flr
const empty = [];
const numbers = [1, 2, 3];
const mixed = Array::new(1, "two", true);
```

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `Array::new(...args)` | `Array` | Creates a new array with optional initial `args`. |
| `Array::from(other)` | `Array` | Creates a new array from an existing Array or Range *(that will fill the array with the values of the range)*. |
| `add(value)` | `Array` | Appends an element to the end. Returns the array. |
| `insert(index, value)` | `Array` | Inserts an element at a specific index. Returns the array. |
| `get(index)` | `Any` | Returns the element at the index *or null if absent*. |
| `set(index, value)` | `Array` | Sets the element at the index. Returns the array. |
| `length()` | `Number` | Returns the number of elements. |
| `pop()` | `Any` | Removes and returns the last element. |
| `contains(value)` | `Boolean` | Checks if a value exists (uses deep equality). |
| `remove(index)` | `Array` | Removes the element at the specified `index`. Returns the array. |
| `clear()` | `Array` | Removes all elements from the array. Returns the array. |
| `index(value)` | `Number,Null` | Returns the index of the first element from the array *or null if absent*. |
| `first()` | `Any` | Returns the first element of the array *or null if absent*. |
| `last()` | `Any` | Returns the last element of the array *or null if absent*. |
| `concat(other_array)` | `Array` | Returns a new array containing elements from both arrays. |

## Bracket Syntax

You can also use bracket syntax to get and set values:

```flr
var list = [1, 2];
list::add(3);
io::print(list[0]); // 1
list[1] = 5;
```

