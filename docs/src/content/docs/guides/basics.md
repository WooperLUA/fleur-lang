---
title: Language Basics
description: Variables, Types, and Operators in fleur.
---

fleur is a dynamically typed language with a clean and modern syntax.

## Variables

fleur supports two types of variable declarations: `const` and `var`.

- `const`: Declares a constant variable that cannot be reassigned.
- `var`: Declares a mutable variable that can be reassigned.

### Immutability of Complex Types

When you use `const` with complex types like **Arrays, Sets, Maps, and Structs**, the value itself becomes immutable. You cannot modify the contents of the collection or the properties of the struct.

```flr
const arr = [1, 2, 3];
// arr::push(4); // Error: Cannot modify a constant array

const user = User { name: "Alice" };
// user.name = "Bob"; // Error: Cannot modify a constant struct
```

```flr
const a = 10;
var b = 20;
b = 30; // OK
// a = 15; // Error
```

## Data Types

### Primitive Types

- **Number**: 64-bit floating point numbers. Supports underscores for readability and leading decimal points.
  ```flr
  const x = 42;
  const y = 3.14;
  const z = .5;
  const large = 1_000_000;
  ```
- **String**: Sequences of characters, enclosed in double quotes. Supports escape characters:
  - `\n` Newline
  - `\t` Tab
  - `\r` Carriage return
  - `\"` Double quote
  - `\\` Backslash
  ```flr
  const name = "fleur Lang";
  const message = "Hello\nWorld";
  ```
- **Boolean**: Logical values `true` or `false`.
  ```flr
  const is_active = true;
  ```
- **Null**: Represents the absence of a value.
  ```flr
  const data = null;
  ```

### Complex Types

- **Arrays**: Ordered collections of values.
- **Sets**: Ordered collections of unique values.
- **Structs**: Custom data structures with named properties.
- **Ranges**: Represent a sequence of numbers (e.g., `1..10`). See the [Ranges Guide](../ranges).
- **Errors**: Represent a error that exits the program unless caught. See the [Errors Guide](../errors).

## Operators

### Arithmetic Operators

| Operator | Description |
| :--- | :--- |
| `+` | Addition (also String concatenation) |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo |
| `-` (unary) | Negation |

```flr
const sum = 10 + 5;
const negative_ten = -10;
const greeting = "Hello " + "World";
```

### Assignment Operators

| Operator | Description |
| :--- | :--- |
| `=` | Assignment |
| `+=` | Add and assign |
| `-=` | Subtract and assign |
| `*=` | Multiply and assign |
| `/=` | Divide and assign |
| `%=` | Modulo and assign |

### Comparison Operators

| Operator | Description |
| :--- | :--- |
| `==` | Equal to |
| `!=` | Not equal to |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal to |
| `>=` | Greater than or equal to |

### Logical Operators

| Operator | Description |
| :--- | :--- |
| `and` | Logical AND |
| `or` | Logical OR |
| `not` | Logical NOT |

```flr
if x > 0 and not is_finished {
    // ...
}
```

