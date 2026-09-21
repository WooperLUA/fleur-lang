---
title: Ranges
description: Working with number sequences and the Range struct in fleur.
---

Ranges in fleur represent a sequence of numbers from a start point to an end point. They are commonly used for iteration, membership tests, and generating other data structures.

## Range Literals

The easiest way to create a range is using the `..` operator.

```flr
const r1 = 1..5;   // 1, 2, 3, 4, 5
const r2 = 10..1;  // 10, 9, 8, ..., 1
```

- **Inclusive**: Both the start and end values are included in the range.
- **Directional**: A range can be ascending (`1..5`) or descending (`5..1`).

## The Range Struct

For more explicit creation or to use range methods, you can use the built-in `Range` struct.

### Constructor

`Range::new(start, end)` returns a new Range object.

```flr
const r = Range::new(1, 10);
```

### Methods

| Method            | Returns   | Description                                                                 |
|:------------------|:----------|:----------------------------------------------------------------------------|
| `contains(value)` | `Boolean` | Returns `true` if the `value` is within the range (inclusive).              |
| `reverse()`       | `Range`   | Reverses the range in-place (swaps start and end). Returns the range.       |
| `reversed()`      | `Range`   | Return a new range being the original range reversed (swaps start and end). |

#### Example: Membership Test

```flr
const r = 1..10;
if r::contains(5) {
    io::print("5 is in the range!");
}
```

#### Example: Reversing a Range

```flr
var r = 1..5;
r::reverse();
// r is now 5..1

var r = 1..5;
io::print(r::reversed()); // 5..1
// r is still 1..5
```

## Usage in Loops

Ranges are the primary way to perform a fixed number of iterations in a `for` loop.

```flr
for i in 1..5 {
    io::print(i); // Prints 1, 2, 3, 4, 5
}
```

The loop automatically determines the step (1 or -1) based on the range direction.

## Integration with Data Structures

Ranges can be used to quickly fill arrays or sets.

```flr
const arr = Array::from(1..5);  // [1, 2, 3, 4, 5]
const s = Set::from(1..3);      // Set(1, 2, 3)
```
