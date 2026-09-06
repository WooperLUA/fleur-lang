---
title: Functions and Procedures
description: Defining and using functions and procedures in fleur.
---

fleur distinguishes between **functions** (which return a value) and **procedures** (which perform an action without returning a value).

## Functions

Functions are defined using the `func` keyword. They typically return a value using the `return` statement.

```flr
func add(a, b) {
    return a + b;
}

const result = add(5, 10);
io::print(result); // 15
```

## Procedures

Procedures are defined using the `proc` keyword. They do not return a value.

```flr
proc greet(name) {
    io::print("Hello, " + name + "!");
}

greet("Alex");
```

## Scoping

Variables declared within a function or procedure are local to that scope.

```flr
func example() {
    const local_var = "I'm local";
    io::print(local_var);
}

// io::print(local_var); // Error: local_var is not defined
```

## Implicit Return

If a function does not have a `return` statement, it returns `null` by default.

