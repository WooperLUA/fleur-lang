---
title: Control Flow
description: Conditionals and Loops in Lys.
---

Lys provides standard control flow structures for branching and iteration.

## Conditionals

### If Statement

The `if` statement allows you to execute code based on a boolean condition.

```lys
const age = 20;

if age >= 18 {
    io::print("Adult");
} else {
    io::print("Minor");
}
```

### When Statement (Pattern Matching)

The `when` statement is a powerful alternative to `switch` or multiple `if-else` blocks. It evaluates an expression and matches it against several cases.

- **Cases**: Each case is defined by a value followed by `=>` and a block of code `{}`.
- **Else**: An optional `else` case can be provided to handle any values not covered by other cases.
- **Strict Equality**: Matching uses deep equality for complex types (Arrays, Structs, etc.).

```lys
const status = 1;

when status {
    0 => { io::print("Idle"); }
    1 => { io::print("Running"); }
    else => { io::print("Unknown"); }
}
```

## Loops

### For Loop (Ranges)

`for` loops in Lys primarily operate over **Ranges**. A range is created using the `..` operator.

- **Inclusive**: The range `1..5` includes both 1 and 5.
- **Automatic Direction**: The loop automatically handles ascending (`1..5`) and descending (`5..1`) ranges.

```lys
// Ascending range: 1, 2, 3, 4, 5
for i in 1..5 {
    io::print(i);
}

// Descending range: 5, 4, 3, 2, 1
for i in 5..1 {
    io::print(i);
}
```

### While Loop

The `while` loop continues to execute as long as its condition remains true. The condition is evaluated *before* each iteration.

```lys
var count = 0;
while count < 3 {
    io::print("Count is: ", count);
    count += 1;
}
```

## Error Handling (Try/Catch)

Lys provides a `try/catch` mechanism to handle runtime errors gracefully.

```lys
try {
    // Code that might fail
    throw("Something went wrong!");
} catch err {
    // Handle error
    io::print("Caught error: ", err);
}
```

*Note: For more details on Error handling and the `Error` struct, see the [Errors Guide](../errors).*
