---
title: Error Handling
description: Using try-catch and the Error struct in Lys.
---

Lys uses a `try-catch` mechanism for handling both runtime and custom errors.

## Try-Catch

The `try` block allows you to execute code that might fail, while the `catch` block handles any resulting errors.

```lys
try {
    const arr = [1, 2];
    io::print(arr[99]); // Triggers OutOfBounds error
} catch err {
    io::print("Caught error: ", err);
}
```

## The Error Struct

Custom errors can be created using the built-in `Error` struct. 

- **Constructor**: `Error::new(message)` returns an Error object.
- **Throwing**: Use the `::throw()` method on an Error object to halt execution and trigger a `catch` block.

```lys
func validate_age(age) {
    if age < 0 {
        // Create and throw in one chain
        Error::new("Age cannot be negative")::throw();
    }
}

try {
    validate_age(-5);
} catch e {
    // e contains the Error object
    io::print(e); // Prints: "Age cannot be negative"
}
```