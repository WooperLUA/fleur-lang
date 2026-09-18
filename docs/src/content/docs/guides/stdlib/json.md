---
title: Json Module
description: Reference for the fleur json module.
---

Provides JSON functions for parsing and stringify JSON.

## Methods

| Member                  | Return Type | Description                                                          |
|:------------------------|:------------|:---------------------------------------------------------------------|
| `parse(s)`              | `Map`       | Returns the parsed `string` `s` (JSON) as a `Map`.                   |
| `string(map_or_struct)` | `String`    | Returns the parsed `Map` or `Struct` `map_or_struct` as a `string`.  |

### Examples

```flr
struct User {
    name: String,
    age: Number,
    skills: Array
}

const alice = User { 
    name: "Alice", 
    age: 28, 
    skills: ["Fleur", "TypeScript"] 
};

const json_string = json::stringify(alice);
io::print(json_string);

const parsed_data = json::parse(json_string);
io::print("Name:", parsed_data["name"]);
io::print("Age:", parsed_data["age"]);
io::print("Skills:", parsed_data["skills"]);
```
