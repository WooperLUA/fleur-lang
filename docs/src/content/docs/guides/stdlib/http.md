---
title: HTTP Module
description: Reference for the fleur http module.
---

Provides functions for making synchronous HTTP requests (GET, POST, PUT, DELETE, etc.).

## Methods

| Member            | Return Type | Description                                                                                                                                                              |
|:------------------|:------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `request(config)` | `Map`       | Makes an HTTP request based on the provided configuration map. Returns a response map containing `status` (Number), `body` (String), `url` (String), and `ok` (Boolean). |

### Configuration Map Keys

The `config` map passed to `http::request` accepts the following keys:

| Key       | Type     | Required | Description                                                                                 |
|:----------|:---------|:---------|:--------------------------------------------------------------------------------------------|
| `url`     | `String` | Yes      | The target URL for the request.                                                             |
| `method`  | `String` | No       | The HTTP method to use (e.g., `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`). Defaults to `"GET"`. |
| `body`    | `String` | No       | The request payload. Automatically sets the `Content-Type` to `application/json`.           |
| `headers` | `Map`    | No       | A map of string keys and string values representing custom HTTP headers.                    |

### Examples

```flr
// Simple GET request
const response = http::request(Map::new([
    ["url", "https://jsonplaceholder.typicode.com/todos/1"]
]));

if response["ok"] 
{
    io::print("Success! Status: ", response["status"]);
    io::print("Body: ", response["body"]);
} 
else 
{
    io::print("Failed with status: ", response["status"]);
}

// POST request with headers and a JSON body
const payload = json::string(Map::new([
    ["title", "Fleur Lang"],
    ["completed", false]
]));


const post_response = http::request(Map::new([
    ["url", "https://jsonplaceholder.typicode.com/todos"],
    ["method", "POST"],
    ["body", payload],
    ["headers", Map::new([
        ["Authorization", "Bearer my_secret_token"],
        ["X-Custom-Header", "Fleur"]
    ])]
]));

io::print("Created resource. Status: ", post_response["status"]);