---
title: Standard Library Reference
description: Overview of fleur built-in modules.
---

fleur comes with several built-in modules to handle I/O, math, strings, and more.

## Modules as Struct Instances

In fleur, standard library modules are actually **instances of structs**. This is why you use the dot `.` operator for properties and the double-colon `::` syntax for methods, as explained in the [Structs Guide](../structs/#accessing-members--vs-).

For example, in the `math` module:
```flr
const p = math.PI;      // PI is a property (a value)
const s = math::sqrt(9); // sqrt is a method (a function)
```

## Available Modules

- [**`crypto`**](./crypto/): Hashing and random identifier generation.
- [**`file`**](./file/): File system operations.
- [**`io`**](./io/): Basic input and output functionality.
- [**`json`**](./json/): JSON parser and stringifier.
- [**`math`**](./math/): Mathematical constants and functions.
- [**`os`**](./os/): Operating system and process information.
- [**`reflect`**](./reflect/): Metaprogramming and introspection for Structs.
- [**`regex`**](./regex/): Regular expression utilities.
- [**`str`**](./str/): String manipulation utilities.
- [**`time`**](./time/): Time-related utilities.
- [**`type`**](./type/): Type checking and explicit conversion.


