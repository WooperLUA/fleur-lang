---
title: Maps
description: Using the Map data structure in Lys.
---

Maps in Lys are collections of key-value pairs. They allow you to associate a unique key with a value.

## Creation

You can create a new map using `Map::new()`.

:::note
Using `const` to declare a Map makes the Map itself **immutable**. You will not be able to modify its values or add/remove keys. Use `var` for a mutable Map.
:::

```lys
var inventory = Map::new();
```

## Methods

| Member | Return Type | Description |
| :--- | :--- | :--- |
| `Map::new()` | `Map` | Creates a new, empty map. |
| `set(key, value)` | `Map` | Associates the specified value with the key. Returns the map. |
| `get(key)` | `Any` | Returns the value associated with the key *or null if absent*. |
| `has(key)` | `Boolean` | Returns `true` if the map contains the specified key. |
| `remove(key)` | `Map` | Removes the mapping for a key. Returns the map. |
| `clear()` | `Map` | Removes all mappings from the map. Returns the map. |
| `length()` | `Number` | Returns the number of key-value pairs in the map. |
| `keys()` | `Array` | Returns an array containing all keys in the map. |
| `values()` | `Array` | Returns an array containing all values in the map. |

## Bracket Syntax

Maps support bracket syntax for getting and setting values, making them feel like native objects or dictionaries.

```lys
var scores = Map::new();
scores["Alice"] = 100;
scores["Bob"] = 90;

io::print(scores["Alice"]); // 100
```

## Deep Equality Keys

One of the most powerful features of Lys Maps is that **keys use deep equality**. This allows you to use complex structures like structs or arrays as keys.

```lys
struct Point { x, y }

var grid = Map::new();
grid[Point { x: 10, y: 20 }] = "Treasure";

// Even a new struct instance with the same values will find the key
const lookup = Point { x: 10, y: 20 };
io::print(grid[lookup]); // "Treasure"
```

## Iteration

You can iterate over the keys or values of a map using `keys()` and `values()` methods.

```lys
var m = Map::new();
m["a"] = 1;
m["b"] = 2;

// Iterate over keys
for k in m::keys() {
    io::print("Key: ", k);
}

// Iterate over values
for v in m::values() {
    io::print("Value: ", v);
}
```
