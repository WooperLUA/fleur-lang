---
title: Yaml Module
description: Reference for the fleur yaml module.
---

Provides YAML functions for parsing and stringify YAML.

## Methods

| Member                  | Return Type | Description                                                          |
|:------------------------|:------------|:---------------------------------------------------------------------|
| `parse(s)`              | `Map`       | Returns the parsed `string` `s` (YAML) as a `Map`.                   |
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

const yaml_string = yaml::string(alice);
io::print(yaml_string);

const parsed_data = yaml::parse(yaml_string);
io::print("Name:", parsed_data["name"]);
io::print("Age:", parsed_data["age"]);
io::print("Skills:", parsed_data["skills"]);
```
