# Performance benchmarks for different JS code constructions

The goal is to check performance for commonly used JS code constructions to ensure the most effective one is used

Covered constructions:
* `for ... of` vs `Array.forEach()`


To print generated byte code run:
```bash
node --print-bytecode --print-bytecode-filter=<method name> <file>
```

## `for ... of` vs `Array.forEach()`
To run performance tests use the following command: 
```bash
npm run forEach 
```