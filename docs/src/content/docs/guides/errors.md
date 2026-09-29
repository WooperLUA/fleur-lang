---
title: Error Handling
description: Using try-catch and the Error struct in fleur.
---

fleur uses a `try-catch` mechanism for handling both runtime and custom errors.

## Try-Catch

The `try` block allows you to execute code that might fail, while the `catch` block handles any resulting errors.

```flr
try {
    const arr = [1, 2];
    io::print(arr[99]); // Triggers OutOfBounds error
} catch err {
    // err is an Error object
    io::print("Caught error: ", err);
}
```

## The Error Struct

Custom errors can be created using the built-in `Error` type. 

```flr
const my_error = Error::new("Something went wrong"); // Runtime
const my_precise_error = Error::new("Something went wrong again", "PreciseError"); // PreciseError
```

### Methods

| Method                   | Returns | Description                                                                              |
|:-------------------------|:--------|:-----------------------------------------------------------------------------------------|
| `Error::new(msg, type?)` | `Error` | Creates a new Error with a message `msg` and an optional `type` *(defaults to Runtime)*. |
| `throw()`                | `Never` | Halts execution and triggers the nearest `catch` block.                                  |

```flr
func validate_age(age) {
    if age < 0 {
        Error::new("Age cannot be negative", "InvalidArgument")::throw();
    }
}
```

## Standard Errors

When fleur encounters an issue during execution, it automatically throws an error *(usually `Runtime` error)*.

These errors are wrapped in an `Error` object, so you can catch them just like custom errors.

```flr
try {
    const x = undefined_var;
} catch e {
    io::print(e); // Prints: "Runtime: Variable 'undefined_var' is not defined."
}
```
