// BAD: Excessive allocations in loops
import { getDifferentObjectArray, getLargeArray, getObjectArray } from '../random.js'

function badArrayConcatenation(arrays) {
  let result = [];

  // Each spread operation creates a new array, copying all existing elements
  for (let i = 0; i < arrays.length; i++) {
    result = [...result, ...arrays[i]]; // O(n) allocation every iteration!
  }

  return result;
}

// GOOD: Efficient concatenation
function goodArrayConcatenation(arrays) {
  const result = [];

  // Push elements directly - no unnecessary copying
  for (let i = 0; i < arrays.length; i++) {
    result.push(...arrays[i]); // Only spreads the current array
  }

  return result;
}

// ============================================================================
// 2. OBJECT SPREAD OPERATOR PERFORMANCE ISSUES
// ============================================================================

// BAD: Creating new objects repeatedly
function badObjectMerging(objects) {
  let result = {};

  // Each spread creates a completely new object, copying all properties
  for (let i = 0; i < objects.length; i++) {
    result = { ...result, ...objects[i] }; // Copies ALL properties every time
  }

  return result;
}

// GOOD: Direct property assignment
function goodObjectMerging(objects) {
  const result = {};

  // Assign properties directly without creating intermediate objects
  for (let i = 0; i < objects.length; i++) {
    Object.assign(result, objects[i]);
  }

  return result;
}

// ============================================================================
// 3. DESTRUCTURING WITH UNNECESSARY ALLOCATIONS
// ============================================================================

// BAD: Destructuring in hot paths
function badDestructuringInLoop(data) {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    // Destructuring creates temporary bindings/references
    const { x, y, z } = data[i];
    sum += x + y + z;
  }

  return sum;
}

// GOOD: Direct property access
function goodDirectAccessInLoop(data) {
  let sum = 0;

  for (let i = 0; i < data.length; i++) {
    // Direct access is faster - no destructuring overhead
    const item = data[i];
    sum += item.x + item.y + item.z;
  }

  return sum;
}

// ============================================================================
// 4. PARAMETER DESTRUCTURING AND OBJECT SHORTHAND PERFORMANCE
// ============================================================================

// BAD: Destructuring parameters + object shorthand in hot paths
function badParameterDestructuring({ a, b, c, d, e, f, g, h }) {
  // Some processing
  const processedA = a * 2;
  const processedB = b + 10;
  const processedC = c.toUpperCase();
  const processedD = d || 'default';

  // Object shorthand creates a new object every call
  return {
    a: processedA,
    b: processedB,
    c: processedC,
    d: processedD,
    e,
    f,
    g,
    h // These are copied even if unchanged
  };
}

// GOOD: Direct parameter access with selective object creation
function goodParameterAccess(data) {
  return {
    a: data.a * 2,
    b: data.b + 10,
    c: data.c.toUpperCase(),
    d: data.d || 'default',
    e: data.e,
    f: data.f,
    g: data.g,
    h: data.h
  };
}

// ============================================================================
// 5. PERFORMANCE TESTING FUNCTIONS
// ============================================================================

// Memory usage estimation
function estimateMemoryUsage(fn, data) {
  // Force garbage collection if available (Node.js with --expose-gc)
  if (global.gc) global.gc();

  const memBefore = process.memoryUsage ? process.memoryUsage().heapUsed : 0;
  const start = performance.now();

  const result = fn(data);

  const end = performance.now();
  const memAfter = process.memoryUsage ? process.memoryUsage().heapUsed : 0;

  return {
    time: end - start,
    memoryDelta: memAfter - memBefore,
    result
  };
}

function runPerformanceTests() {
  console.log('Performance Impact of Destructuring and Spread Operators');

  // Destructuring test
  const objectData = getObjectArray(100000);
  console.group('Destructuring vs Direct Access Test [in loop]:');
  console.log('JIT warmup...');
  for (let i = 0; i < 1e4; i++) {
    badDestructuringInLoop(objectData);
    goodDirectAccessInLoop(objectData);
  }

  const badDestructResult = estimateMemoryUsage(badDestructuringInLoop, objectData);
  const goodDirectResult = estimateMemoryUsage(goodDirectAccessInLoop, objectData);

  console.log(
    `Bad (destructuring): ${badDestructResult.time.toFixed(2)}ms, Memory: ${formatBytes(badDestructResult.memoryDelta)}`
  );
  console.log(
    `Good (direct access): ${goodDirectResult.time.toFixed(2)}ms, Memory: ${formatBytes(goodDirectResult.memoryDelta)}`
  );
  console.log(`Time difference: ${(badDestructResult.time / goodDirectResult.time).toFixed(1)}x slower`);
  console.log(
    `Memory difference: ${(badDestructResult.memoryDelta / Math.max(goodDirectResult.memoryDelta, 1)).toFixed(1)}x more memory\n`
  );
  console.groupEnd();

  // Array concatenation test
  const arrays = getLargeArray(1000);
  console.group('Array Concatenation Test:');

  console.log('JIT warmup...');
  for (let i = 0; i < 1e2; i++) {
    badArrayConcatenation(arrays);
    goodArrayConcatenation(arrays);
  }

  const badArrayConcatenationResult = estimateMemoryUsage(badArrayConcatenation, arrays);
  const goodArrayConcatenationResult = estimateMemoryUsage(goodArrayConcatenation, arrays);

  console.log(
    `Bad (spread): ${badArrayConcatenationResult.time.toFixed(2)}ms, Memory: ${formatBytes(badArrayConcatenationResult.memoryDelta)}`
  );
  console.log(
    `Good (push): ${goodArrayConcatenationResult.time.toFixed(2)}ms, Memory: ${formatBytes(goodArrayConcatenationResult.memoryDelta)}`
  );
  console.log(
    `Time difference: ${(badArrayConcatenationResult.time / goodArrayConcatenationResult.time).toFixed(1)}x slower`
  );
  console.log(
    `Memory difference: ${(badArrayConcatenationResult.memoryDelta / Math.max(goodArrayConcatenationResult.memoryDelta, 1)).toFixed(1)}x more memory\n`
  );
  console.groupEnd();

  // Object merging test
  const objects = Array.from({ length: 50 }, (_, i) =>
    Object.fromEntries(Array.from({ length: 20 }, (_, j) => [`prop${j}`, i * j]))
  );

  console.group('Object Merging Test:');
  console.log('JIT warmup...');
  for (let i = 0; i < 1e4; i++) {
    badObjectMerging(objects);
    goodObjectMerging(objects);
  }

  const badObjectResult = estimateMemoryUsage(badObjectMerging, objects);
  const goodObjectResult = estimateMemoryUsage(goodObjectMerging, objects);

  console.log(
    `Bad (spread): ${badObjectResult.time.toFixed(2)}ms, Memory: ${formatBytes(badObjectResult.memoryDelta)}`
  );
  console.log(
    `Good (assign): ${goodObjectResult.time.toFixed(2)}ms, Memory: ${formatBytes(goodObjectResult.memoryDelta)}`
  );
  console.log(`Time difference: ${(badObjectResult.time / goodObjectResult.time).toFixed(1)}x slower`);
  console.log(
    `Memory difference: ${(badObjectResult.memoryDelta / Math.max(goodObjectResult.memoryDelta, 1)).toFixed(1)}x more memory\n`
  );
  console.groupEnd();

  // Parameter destructuring test
  console.group('Parameter Destructuring vs Direct Access Test [same object structure]:');
  const paramTestData = getObjectArray(100000);

  console.log('JIT warmup...');
  for (let i = 0; i < 1e2; i++) {
    paramTestData.map(item => badParameterDestructuring(item));
    paramTestData.map(item => goodParameterAccess(item));
  }

  const badParamResult = estimateMemoryUsage(
    data => data.map(item => badParameterDestructuring(item)),
    paramTestData
  );

  const goodParamResult = estimateMemoryUsage(data => data.map(item => goodParameterAccess(item)), paramTestData);

  console.log(
    `Bad (param destructuring): ${badParamResult.time.toFixed(4)}ms, Memory: ${formatBytes(badParamResult.memoryDelta)}`
  );
  console.log(
    `Good (direct access): ${goodParamResult.time.toFixed(4)}ms, Memory: ${formatBytes(goodParamResult.memoryDelta)}`
  );
  console.log(`Time difference: ${(badParamResult.time / goodParamResult.time).toFixed(1)}x slower`);
  console.log(
    `Memory difference: ${(badParamResult.memoryDelta / Math.max(goodParamResult.memoryDelta, 1)).toFixed(1)}x more memory\n`
  );
  console.groupEnd();

  // Parameter destructuring test #2
  console.group('Parameter Destructuring vs Direct Access Test [different object structure]:');
  const diffObjectArrayTestData = getDifferentObjectArray(50000);

  console.log('JIT warmup...');
  for (let i = 0; i < 1e2; i++) {
    diffObjectArrayTestData.map(item => badParameterDestructuring(item));
    diffObjectArrayTestData.map(item => goodParameterAccess(item));
  }

  const badParamResultV2 = estimateMemoryUsage(
    data => data.map(item => badParameterDestructuring(item)),
    diffObjectArrayTestData
  );

  const goodParamResultV2 = estimateMemoryUsage(
    data => data.map(item => goodParameterAccess(item)),
    diffObjectArrayTestData
  );

  console.log(
    `Bad (param destructuring): ${badParamResultV2.time.toFixed(4)}ms, Memory: ${formatBytes(badParamResultV2.memoryDelta)}`
  );
  console.log(
    `Good (direct access): ${goodParamResultV2.time.toFixed(4)}ms, Memory: ${formatBytes(goodParamResultV2.memoryDelta)}`
  );
  console.log(`Time difference: ${(badParamResultV2.time / goodParamResultV2.time).toFixed(1)}x slower`);
  console.log(
    `Memory difference: ${(badParamResultV2.memoryDelta / Math.max(goodParamResultV2.memoryDelta, 1)).toFixed(1)}x more memory\n`
  );
}

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

// Run the tests
runPerformanceTests();
