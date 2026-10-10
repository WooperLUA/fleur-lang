---
title: Functions and Procedures
description: Defining and using functions, procedures, and anonymous closures in Fleur.
---

Fleur distinguishes between **functions** (which return a value) and **procedures** (which perform an action without returning a value).

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

Procedures are defined using the `proc` keyword. They do not return a value and are used purely for their side effects (like printing or modifying state).

```flr
proc greet(name) {
    io::print("Hello, " + name + "!");
}

greet("Alex");
```

## Syntactic Sugar

One-line functions and procedures can be written in a shorter syntax using the `=>` operator.

:::note
One-line functions implicitly return the value of the expression, so there is no need to add a `return` statement. They also do not require a trailing semicolon, making them perfectly consistent with the `{}` block syntax.
:::

```flr
func add(a, b) => a + b

proc greet(name) => io::print("Hello, " + name + "!")
```

## Scoping

Variables declared within a function or procedure are local to that scope and cannot be accessed from the outside.

```flr
func example() {
    const local_var = "I'm local";
    io::print(local_var);
}

example();
// io::print(local_var); // Error: local_var is not defined
```

## Optional Parameters

Parameters assigned a default value using the `=` operator become **optional**. They must be placed at the end of the parameter list.

```flr
func foo(a, b = "default_b") {
    return [a, b];
}

io::print(foo("a"));       // ["a", "default_b"] 
io::print(foo("a", "c"));  // ["a", "c"] 
```

## Lambda Expression | Lambda Statement

Fleur supports **lambda expressions** and **lambda statements**. These allow you to define unnamed functions and procedures that can be assigned to variables, passed as arguments, or returned from other functions.

### Basic Syntax

Lambda expressions and lambda statements use the same `func` or `proc` keywords, but simply omit the name. They support both the concise arrow syntax (`=>`) and standard blocks (`{}`).

```flr
// Lambda expressions
const multiply = func(x, y) => x * y;
const divide = func(x, y) => { 
    return x / y; 
}

// Lambda statements
const logger = proc(msg) => io::print("[LOG]: " + msg;
const error = proc(msg) {
    io::print("[ERROR]: " + msg);
    os::exit(1);
};

```

### Closures

Lambda expressions and lambda statements in Fleur are **closures**. This means they can capture and remember variables from the lexical scope in which they were created.

```flr
func create_multiplier(factor) {
    // The returned lambda expression captures the 'factor' variable
    return func(x) => x * factor;
}

const double = create_multiplier(2);
const triple = create_multiplier(3);

io::print(double(5)); // 10
io::print(triple(5)); // 15
```