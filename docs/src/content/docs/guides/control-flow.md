---
title: Control Flow
description: Conditionals and Loops in fleur.
---

fleur provides standard control flow structures for branching and iteration.

## Conditionals

### If Statement

The `if` statement allows you to execute code based on a boolean condition.

```flr
const age = 20;

if age >= 18 {
    io::print("Adult");
} else {
    io::print("Minor");
}
```

## Syntactic Sugar

One-line `if` statements can be written in a shorter syntax without `{}`.

```flr
const age = 20;

if age >= 18 
    io::print("Adult");
else 
    io::print("Minor");
```

### Conditional Expressions

An `if`/`else` can also be used as an expression, which makes it behave like a ternary. The `else` branch is required, and both branches are expressions.

```flr
const age = 20;
const label = if age >= 18 "Adult" else "Minor";
io::print(label);
```

This is especially useful in assignments and return statements.

```flr
func sign(value) {
    return if value < 0 "negative" else "positive";
}
```

While ternaries can be nested they are not recommended if they make the code hard to read / understand / refactor.

```flr
// That's a bad practice, use when expressions or a Map.
func grade_from_score(score) {
    return if score > 18 "A" 
           else if score > 14 "B"
           else if score > 10 "C"
           else if score > 6 "D"
           else "E";
}
```

### When Statement (Pattern Matching)

The `when` statement is a powerful alternative to `switch` or multiple `if-else` blocks. It evaluates an expression and matches it against several cases.

- **Cases**: Each case is defined by a value followed by `=>` and a block of code `{}`. One line statements don't require `{}`.
- **Else**: An optional `else` case can be provided to handle any values not covered by other cases.
- **Strict Equality**: Matching uses deep equality for complex types (Arrays, Structs, etc.).

```flr
var status = 1;

when status {
    0 => io::print("Idle");
    1 => io::print("Running"); 
    else => { 
        io::print("Unknown"); 
        status = 0;
    }
}
```

### When Expression

`when` can also be used as an expression, so each case produces a value. This is useful in assignments and return statements.

```flr
func describe(status) {
    return when status {
        0 => "Idle";
        1 => "Running";
        else => "Unknown";
    };
}

const label = when status {
    0 => "Idle";
    1 => "Running";
    else => "Unknown";
};
```

If no case matches and there is no `else` case, the expression evaluates to `null`.

## Loops

### For Loop (Ranges)

`for` loops in fleur primarily operate over **Ranges**. See the [Ranges Guide](../ranges) for more details.

### For Loop (Arrays and Sets)

`for` loops in fleur can also operate over **Arrays** and **Sets**.

```flr
for elt in [1,2,3,4,5]{
    io::print(elt);
}

for elt in Set::new(1,2,3,4,5){
    io::print(elt);
}
```

## Syntactic Sugar

One-line `for` loops can be written in a shorter syntax without `{}`.

```flr
for elt in [1,2,3,4,5]
    io::print(elt);


for elt in Set::new(1,2,3,4,5)
    io::print(elt);
```

### While Loop

The `while` loop continues to execute as long as its condition remains true. The condition is evaluated *before* each iteration.

```flr
var count = 0;
while count < 3 {
    io::print("Count is: ", count);
    count += 1;
}
```

## Syntactic Sugar

One-line `while` loops can be written in a shorter syntax without `{}`.
```flr
var arr = [1,2,3];
while not arr::empty() 
    arr::shift();
```

### Breaking and continuing

You can use the `break` or `continue` keyword to exit or continue iteration.

```flr
for i in 1..10
{
    continue;
    break; // will exit on first iteration
}
```

## Error Handling (Try/Catch)

fleur provides a `try/catch` mechanism to handle runtime errors gracefully.

```flr
try {
    // Code that might fail
    throw("Something went wrong!");
} catch err {
    // Handle error
    io::print("Caught error: ", err);
}
```

*Note: For more details on Error handling and the `Error` struct, see the [Errors Guide](../errors).*

