# Todo list for Lys

## Scale of importance :
 - High
 - Moderate
 - Low


## Import | Module system with multiple file imports
### *Moderate*
On one hand Lys is not made to do real programs with so implementing a tedious system like this makes no sens but having a proper
import | module system would make Lys more useful and teach about imports.
```typescript
// file1.lys
pub const x = 5;
pub func foo()
{
    return 1;
}
pub struct Point
{
    x,
    y
}

// file2.lys
import [x, foo, Point] in 'file1.lys'
```


## Struct built-in methods
### *Moderate*
I hate how they look and feel but I cant find better names for now.
```typescript
const a = A {};
a::has_property("foo");   // ew
a::add_property("foo");   // no ?
a::remove_propery("foo"); // please stop
a::struct_name();         // am I supposed to guess that ?
```


## Ternary expressions
### *Low*
Ternaries add a bit of complexity, but I feel like they really remove some if boilerplate + are very common in most languages.
```typescript
const time_suffix = hours > 12 ? "pm" : "am"
```
