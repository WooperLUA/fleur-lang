---
title: Type Annotations
description: Type Annotations in fleur.
---

fleur supports optional type annotations for variables, struct fields, and functions. These annotations help catch type mismatches at runtime.

### Variable Annotations

You can annotate variables during declaration using the `: Type` syntax.

```flr
const count: Number = 42;
const name: String = "fleur";
const isActive: Boolean = true;
const values: Array = [1, 2, 3];
```

If a value of a different type is assigned, fleur will throw a runtime error.

### Struct Field Annotations

Struct fields can be annotated to ensure that instances are created with the correct data types.

```flr
struct User {
    name: String,
    age: Number
}

const alice = User { name: "Alice", age: 30 };
// const bob = User { name: "Bob", age: "thirty" }; // Error: age must be a Number
```

### Function and Procedure Annotations

Functions can have annotations for both parameters and return values.

```flr
func add(a: Number, b: Number): Number {
    return a + b;
}

proc greet(name: String) {
    io::print("Hello, " + name);
}
```

If a parameter type or the return type does not match the annotation, an error is thrown.

### Custom Types

You can use your own structs as type annotations.

```flr
struct Point { x: Number, y: Number }

func distance(p: Point): Number {
    // ...
}
```

### Union Types

By using the `or` operator, you can specify that a value is either a type or another type.

```flr
const numb_or_str: Number or String = 6; // or "6"
```

