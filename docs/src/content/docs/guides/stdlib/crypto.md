---
title: Crypto Module
description: Reference for the fleur crypto module.
---

Provides cryptographic functions for hashing and generating unique identifiers.

## Methods

| Member         | Return Type | Description                                                            |
|:---------------|:------------|:-----------------------------------------------------------------------|
| `sha256(data)` | `String`    | Returns the SHA-256 hash of the input string as a hexadecimal string.  |
| `sha512(data)` | `String`    | Returns the SHA-512 hash of the input string as a hexadecimal string.  |
| `md5(data)`    | `String`    | Returns the MD5 hash of the input string as a hexadecimal string.      |
| `uuid()`       | `String`    | Returns a randomly generated UUID (v4) string.                         |

### Examples

```flr
// Hash a string using SHA-256
const hashed = crypto::sha256("password123");
io::print(hashed);

// Generate a random UUID
const id = crypto::uuid();
io::print("New ID: ", id);
```
