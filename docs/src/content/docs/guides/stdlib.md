---
title: Standard Library Reference
description: Overview of Lys built-in modules.
---

Lys comes with several built-in modules to handle I/O, math, strings, and more.

## Modules as Struct Instances

In Lys, standard library modules are actually **instances of structs**. This is why you use the dot `.` operator for properties and the double-colon `::` syntax for methods, as explained in the [Structs Guide](../structs/#accessing-members--vs-).

For example, in the `math` module:
```lys
const p = math.PI;      // PI is a property (a value)
const s = math::sqrt(9); // sqrt is a method (a function)
```

## Available Modules

- [**`io`**](./io/): Basic input and output functionality.
- [**`math`**](./math/): Mathematical constants and functions.
- [**`str`**](./str/): String manipulation utilities.
- [**`file`**](./file/): File system operations.
- [**`type`**](./type/): Type checking and explicit conversion.
- [**`os`**](./os/): Operating system and process information.
- [**`time`**](./time/): Time-related utilities.
- [**`regex`**](./regex/): Regular expression utilities.
- [**`reflect`**](./reflect/): Metaprogramming and introspection for Structs.
