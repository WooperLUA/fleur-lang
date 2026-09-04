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

- [**`io`**](./stdlib/io/): Basic input and output functionality.
- [**`math`**](./stdlib/math/): Mathematical constants and functions.
- [**`str`**](./stdlib/str/): String manipulation utilities.
- [**`file`**](./stdlib/file/): File system operations.
- [**`type`**](./stdlib/type/): Type checking and explicit conversion.
- [**`os`**](./stdlib/os/): Operating system and process information.
- [**`time`**](./stdlib/time/): Time-related utilities.
- [**`regex`**](./stdlib/regex/): Regular expression utilities.
- [**`reflect`**](./stdlib/reflect/): Metaprogramming and introspection for Structs.
