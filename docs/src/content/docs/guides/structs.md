---
title: Structs
description: Custom data structures in Lys.
---

Structs allow you to define custom data types with named properties and methods.

## Definition and Literal Creation

:::note
Using `const` to declare an instance of struct makes it **immutable**. You will not be able to modify its properties or call methods that attempt to modify `this`.
:::


```lys
struct Point {
    x,
    y
}

const p = Point { x: 10, y: 20 };
io::print(p.x); // 10
```

## Accessing Members: `.` vs `::`

Struct instances use two different operators to access their members:

- **Properties** (Values) are accessed using the dot `.` operator.
- **Methods** (Functions) are accessed using the double-colon `::` operator.

```lys
struct Point { x, y }
Point::move(dx, dy) {
    this.x += dx;
    this.y += dy;
}

var p = Point { x: 10, y: 20 };
io::print(p.x);    // Access property with .
p::move(5, 5);     // Call method with ::
```

## Static Methods and Constructors

Structs support a very limited form of static methods. **Only the `::new` method can be called directly on the Struct definition.** This is typically used as a constructor.

```lys
User::new(name, age) {
    return User { name: name, age: age };
}

// Allowed
const u = User::new("Alex", 25);

// Not Allowed: You cannot define or call other static methods like User::do_something()
```

## Instance Methods

Instance methods use `this` to refer to the current struct instance.

```lys
User::is_adult() {
    return this.age >= 18;
}

if u::is_adult() {
    io::print("Welcome");
}
```
