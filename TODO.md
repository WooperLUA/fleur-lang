# Todo list for Lys

## Scale of importance :
 - High
 - Moderate
 - Low


## Make const arrays, sets and structs (properties) actually immutable and not only reference immutable
### *High*
We just have to make add methods and assignment look for is_const. I think complete immutability suits Lys's phylosophie better.


## Foreach keyword for arrays, sets and structs as a syntax sugar for range loops
### *Low*
It may remove from Lys's simplicity, but it's a very handy feature that is now present everywhere.
```typescript
const arr = [1,2,3];
for elt in arr
{
    io::print(elt);
}
```

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


## Error handling
### *Moderate*
Error handling is a very complex topic and many languages have their own implementation of it.
I suggest adding some kind of basic error | exception to Lys to teach about their usage without making them too verbose | complex.
Error should probably be a type and a data structure.
```typescript
func divide(a, b)
{
    if b == 0 
    {
        throw Error::new("Division by zero is not allowed");
    }
    return a / b;
}

try 
{
    divide(10, 0);
} 
catch e 
{
    io::print("Caught an error:", e);
}

// Works perfectly with internal runtime errors too
try 
{
    const arr = [1, 2, 3];
    io::print(arr[99]);
} 
catch err 
{
    io::print("Safely handled out of bounds:", err);
}
```
