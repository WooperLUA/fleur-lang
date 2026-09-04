---
title: Modules and Imports
description: Organizing Lys code into multiple files.
---

Lys allows you to split your code into multiple files using a simple module system.

## Exporting

To make a variable, function, or struct available to other files, use the `pub` keyword.

```lys
// math_utils.lys
pub const PI = 3.14;

pub func square(x) {
    return x * x;
}

pub struct Point { x, y }
```

## Importing

Use the `import` statement to bring public members from another file into your current scope.

- **Syntax**: `import [Names] in "path";`
- **Relative Paths**: The source path must be a string and is relative to the current file.
- **Selective**: You only import what you explicitly list in the brackets.

```lys
// main.lys
import [PI, square, Point] in "./utils/math_utils.lys";

io::print(PI);
io::print(square(4));

const p = Point { x: 0, y: 0 };
```

### Module Resolution

When you import a file, Lys parses and executes that file in its own scope. Only members marked with `pub` are added to the importing file's scope. 

*Note: The standard library modules (like `io`, `math`, `str`) are globally available and do not need to be imported.*
