---
title: Reflect Module
description: Reference for the fleur reflect module.
---

Metaprogramming and introspection for Structs and other data structures.

## Properties

| Member       | Description                                                      |
|:-------------|:-----------------------------------------------------------------|
| `properties` | Sub-struct of `reflect` related to struct's instance properties. |

## Methods

### `reflect`

| Member                | Return Type | Description                                                                                |
|:----------------------|:------------|:-------------------------------------------------------------------------------------------|
| `identifier(struct)`  | `String`    | Returns the name of the Struct definition used to create the instance.                     |
| `fields(struct_decl)` | `Array`     | Returns an array of field names for a struct declaration (e.g., `reflect::fields(Point)`). |
| `is(a, b)`            | `Boolean`   | Returns `true` if `a` and `b` are the exact same object in memory (reference equality).    |
| `clone(ds)`           | `Any`       | Returns a deep copy of `ds` (supports `Struct`, `Array`, `Set`, `Map`, `Range`, `Error`).  |

### `reflect.properties`

| Member                  | Return Type     | Description                                                                              |
|:------------------------|:----------------|:-----------------------------------------------------------------------------------------|
| `has(struct, key)`      | `Boolean`       | Returns `true` if the `struct` instance has a property named `key`.                      |
| `get(struct, key)`      | `Any` or `Null` | Returns the value of the property `key` from the `struct` instance, or `null` if absent. |
| `set(struct, key, val)` | `Null`          | Sets the property `key` of the `struct` instance to `val`.                               |
| `remove(struct, key)`   | `Boolean`       | Deletes the property `key` from the `struct` instance. Returns `true` if successful.     |
| `pairs(struct)`         | `Map`           | Returns a map containing all the properties and their values of the `struct` instance.   |

## Examples

```flr
struct Point { x, y }
const p = Point { x: 1, y: 2 };

// Basic reflection
io::print(reflect::identifier(p)); // "Point"

// Getting struct fields (requires the declaration, not the instance)
io::print(reflect::fields(Point)); // ["x", "y"]

// Property manipulation
io::print(reflect.properties::has(p, "x"));   // true
reflect.properties::set(p, "z", 3);
io::print(reflect.properties::get(p, "z"));   // 3

// Getting all properties as a Map
const props = reflect.properties::pairs(p);
io::print(props); // { "x": 1, "y": 2, "z": 3 }

// Reference equality
const p2 = p;
io::print(reflect::is(p, p2)); // true

// Deep cloning
const p3 = reflect::clone(p);
io::print(reflect::is(p, p3)); // false