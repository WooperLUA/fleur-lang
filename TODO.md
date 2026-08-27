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
