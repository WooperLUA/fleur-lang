---
title: Sets
description: Using the Set data structure in Lys.
---

Sets in Lys are ordered collections of unique values. They are implemented as arrays that automatically handle duplicate prevention using deep equality.

## Creation

You can create a new set using `Set::new()` or `Set::from()`.

:::note
Using `const` to declare a Set makes the Set itself **immutable**. You will not be able to use methods that modify the set (like `add`, `remove`, or `clear`). Use `var` for a mutable Set.
:::

```lys
// Create an empty set (mutable)
var my_set = Set::new();
my_set::add(1);

// Create an immutable set
const fixed_set = Set::new(1, 2, 3);
// fixed_set::add(4); // This will cause a runtime error
```

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `Set::new(...args)` | `Set` | Creates a new set with optional initial `args`. |
| `Set::from(other)` | `Set` | Creates a new set from an existing Array or Set. |
| `add(value)` | `Set` | Adds a value to the set if it doesn't already exist. Returns the set. |
| `remove(value)` | `Set` | Removes a value from the set. Returns the set. |
| `clear()` | `Set` | Removes all elements from the set. Returns the set. |
| `contains(value)` | `Boolean` | Returns `true` if the value is in the set. |
| `length()` | `Number` | Returns the number of elements in the set. |
| `index(value)` | `Number` | Returns the index of the value in the set (since Lys sets are ordered). |
| `first()` | `Any` | Returns the first element. |
| `last()` | `Any` | Returns the last element. |
| `get(index)` | `Any` | Returns the element at the specified index. |
| `set(index, value)` | `Set` | Updates the value at the specified index (ensuring uniqueness). Returns the set. |
| `insert(index, value)` | `Set` | Inserts a value at a specific index. Returns the set. |
| `pop()` | `Any` | Removes and returns the last element. |
| `concat(other_set)` | `Set` | Returns a new set containing elements from both sets. |
