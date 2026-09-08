---
title: Math Module
description: Reference for the fleur math module.
---

Provides mathematical constants and functions.

## Properties

| Member | Description |
| :--- | :--- |
| `PI` | The ratio of a circle's circumference to its diameter (~3.14159). |

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `abs(x)` | `Number` | Returns the absolute value of `x`. |
| `min(a, b)` | `Number` | Returns the smaller of two numbers `a` and `b`. |
| `max(a, b)` | `Number` | Returns the larger of two numbers `a` and `b`. |
| `round(x)` | `Number` | Returns the value of `x rounded to the nearest integer. |
| `floor(x)` | `Number` | Returns the largest integer less than or equal to `x`. |
| `ceil(x)` | `Number` | Returns the smallest integer greater than or equal to `x`. |
| `sin(x)` | `Number` | Returns the sine of `x` (in radians). |
| `cos(x)` | `Number` | Returns the cosine of `x` (in radians). |
| `tan(x)` | `Number` | Returns the tangent of `x` (in radians). |
| `random(range)` | `Number` | Returns a random number within the given `range`, will return integers or floats depending on the extremities of the range. |
| `float(x)` | `Number` | Formats a number `x` to a single decimal place. |
| `int(x)` | `Number` | Parses a number `x` into an integer (truncating decimals). |
| `clamp(x, range)` | `Number` | Clamps the value `x` to be within the `range` (e.g., `math::clamp(15, 0..10)` returns `10`). |
| `sum(ds)` | `Number` | Reduces an `array`, `set` or `range` to a sum *or throws an `error` if the `array` or `set` contains anything other than `numbers`*. |

### Examples

```flr
const radius = 5;
const area = math.PI * radius * radius;
const dice_roll = math::random(1..7); // 1 to 6
```

