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

You can also provide a step as the middle value:

```flr
const r3 = 1..2..10;  // 1, 3, 5, 7, 9
const r4 = 10..2..1;  // 10, 8, 6, 4, 2
const r5 = 1..0.5..3; // 1, 1.5, 2, 2.5, 3
```

- **Inclusive**: Both the start and end values are included in the range.
- **Directional**: A range can be ascending (`1..5`) or descending (`5..1`).
- **Step**: The optional middle value controls how much the range advances on each iteration. It is a non-zero magnitude; the direction is still determined by the start and end values, so `10..1..1` descends and `1..1..10` ascends. The default step is `1`.

## The Range Struct

For more explicit creation or to use range methods, you can use the built-in `Range` struct.

### Constructor

`Range::new(start, end)` returns a new Range object. To create a stepped range, use `Range::new(start, step, end)`, which mirrors the `start..step..end` literal syntax.

```flr
const r = Range::new(1, 10);
const stepped = Range::new(1, 2, 10); // 1, 3, 5, 7, 9
```

### Methods

| Method            | Returns   | Description                                                                 |
|:------------------|:----------|:----------------------------------------------------------------------------|
| `start()`         | `Number`  | Returns the start (first element) of the range.                             |
| `end()`           | `Number`  | Returns the end (last element) of the range.                                |
| `step()`          | `Number`  | Returns the step of the range (`1` if no step was specified).               |
| `contains(value)` | `Boolean` | Returns `true` if the `value` is within the range (inclusive).              |
| `reverse()`       | `Range`   | Reverses the range in-place (swaps start and end). Returns the range.       |
| `reversed()`      | `Range`   | Return a new range being the original range reversed (swaps start and end). |
| `sum()`           | `Number`  | Return the sum of all the elements in the range *(O(1) complexity)*.        |

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

The loop automatically determines the direction (ascending or descending) based on the range, and advances by the range's step (default `1`).

## Integration with Data Structures

Ranges can be used to quickly fill arrays or sets.

```flr
const arr = Array::from(1..5);  // [1, 2, 3, 4, 5]
const s = Set::from(1..3);      // Set(1, 2, 3)
```
