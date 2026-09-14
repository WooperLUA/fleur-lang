---
title: Sets
description: Using the Set data structure in fleur.
---

Sets in fleur are ordered collections of unique values. They are implemented as arrays that automatically handle duplicate prevention using deep equality.

## Creation

You can create a new set using `Set::new()` or `Set::from()`.

:::note
Using `const` to declare a Set makes the Set itself **immutable**. You will not be able to use methods that modify the set (like `add`, `remove`, or `clear`). Use `var` for a mutable Set.
:::

```flr
// Create an empty set (mutable)
var my_set = Set::new();
my_set::add(1);

// Create an immutable set
const fixed_set = Set::new(1, 2, 3);
// fixed_set::add(4); // This will cause a runtime error
```

## Methods

| Member                             | Return Type   | Description                                                                                                                                              |
|:-----------------------------------|:--------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Set::new(...args)`                | `Set`         | Creates a new set with optional initial `args`.                                                                                                          |
| `Set::from(other)`                 | `Set`         | Creates a new set from an existing Set or Range *(that will fill the set with the values of the range)*.                                                 |
| `Set::concat(set, other_set)`      | `Set`         | Returns a new set containing elements from both sets.                                                                                                    |
| `add(value)`                       | `Set`         | Adds a value to the set if it doesn't already exist. Returns the set.                                                                                    |
| `remove(value)`                    | `Set`         | Removes a value from the set. Returns the set.                                                                                                           |
| `clear()`                          | `Set`         | Removes all elements from the set. Returns the set.                                                                                                      |
| `contains(value)`                  | `Boolean`     | Returns `true` if the value is in the set.                                                                                                               |
| `length()`                         | `Number`      | Returns the number of elements in the set.                                                                                                               |
| `index(value)`                     | `Number,Null` | Returns the index of the value in the set (since fleur sets are ordered).                                                                                |
| `first()`                          | `Any`         | Returns the first element of the set *or null if absent*.                                                                                                |
| `last()`                           | `Any`         | Returns the last element of the set *or null if absent*.                                                                                                 |
| `get(index)`                       | `Any`         | Returns the element at the specified index *or null if absent*.                                                                                          |
| `set(index, value)`                | `Set`         | Updates the value at the specified index (ensuring uniqueness). Returns the set.                                                                         |
| `insert(index, value)`             | `Set`         | Inserts a value at a specific index. Returns the set.                                                                                                    |
| `pop()`                            | `Any`         | Removes and returns the last element.                                                                                                                    |
| `slice(range)`                     | `Set`         | Mutates the set to a portion of the original set defined by a `Range`. Returns the set.                                                                  |
| `sliced(range)`                    | `Set`         | Returns a new set containing a portion of the original set defined by a `Range`.                                                                         |
| `reverse()`                        | `Set`         | Mutates the set to the original set reversed. Returns the set.                                                                                           |
| `reversed()`                       | `Set`         | Returns a new set being the original set reversed.                                                                                                       |
| `sort()`                           | `Set`         | Sorts the set in place in ascending order, the set must only contain one `type` that is `Number`,`String`,`Boolean` or `Range`. Returns the set.         |
| `sorted()`                         | `Set`         | Returns a new set being the original set sorted in ascending order, the set must only contain one `type` that is `Number`,`String`,`Boolean` or `Range`. |

