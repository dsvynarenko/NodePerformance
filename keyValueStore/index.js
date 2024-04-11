import { clearObjectMap, existsObjectMap, fillObjectMap, getObjectMap, iterateThroughObjectMap } from './objectMap.js'
import { clearNativeMap, existsNativeMap, fillNativeMap, getNativeMap, iterateThroughNativeMap } from './nativeMap.js'
import {
  generateDefaultStringArray,
  generateHalfRandomArray, generateHashedStringArray,
  memoryUsedInKB
} from './preparation.js'

// constants
const WARM_UP_CYCLES = 100
const WARMUP_ARRAY_LENGTH = 1_000
const EXPERIMENTS_ARRAY_LENGTHS = [100, 1_000, 100_000, 200_000, 500_000]
const MEMORY_ARRAY_LENGTHS = [10_000, 100_000, 200_000, 500_000, 1_000_000]
const EXPERIMENTS_COUNT = 20

// warm-up
console.log('Warming up...')
for (let i = 0; i < WARM_UP_CYCLES; i++) {
  const keys = generateDefaultStringArray(WARMUP_ARRAY_LENGTH)
  const values = generateDefaultStringArray(WARMUP_ARRAY_LENGTH)
  const halfRandomKeys = generateHalfRandomArray(keys)

  // warmup fill
  const objectMap = fillObjectMap(keys, values)
  const nativeMap = fillNativeMap(keys, values)

  // warmup exists
  const resultExistsObjectMap = Array(halfRandomKeys.length)
  const resultExistsNativeMap = Array(halfRandomKeys.length)
  existsObjectMap(objectMap, halfRandomKeys, resultExistsObjectMap)
  existsNativeMap(nativeMap, halfRandomKeys, resultExistsNativeMap)

  for (let j = 0; j < WARMUP_ARRAY_LENGTH; j++) {
    if (resultExistsObjectMap[j] !== resultExistsNativeMap[j]) {
      console.log('Incorrect results on exists warmup')
      process.exit(1)
    }
  }

  // warmup get
  const resultGetObjectMap = Array(halfRandomKeys.length)
  const resultGetNativeMap = Array(halfRandomKeys.length)
  getObjectMap(objectMap, halfRandomKeys, resultGetObjectMap)
  getNativeMap(nativeMap, halfRandomKeys, resultGetNativeMap)

  for (let j = 0; j < WARMUP_ARRAY_LENGTH; j++) {
    if (resultGetObjectMap[j] !== resultGetNativeMap[j]) {
      console.log('Incorrect results on get warmup')
      process.exit(1)
    }
  }

  // warmup iterator
  const resultIterateObjectMap = Array(nativeMap.size)
  const resultIterateNativeMap = Array(nativeMap.size)
  iterateThroughObjectMap(objectMap, nativeMap.size, resultIterateObjectMap)
  iterateThroughNativeMap(nativeMap, nativeMap.size, resultIterateNativeMap)

  for (let j = 0; j < nativeMap.size; j++) {
    if (resultIterateObjectMap[j][0] !== resultIterateNativeMap[j][0] ||
      resultIterateObjectMap[j][1] !== resultIterateNativeMap[j][1]) {
      console.log('Incorrect results on iterator warmup')
      process.exit(1)
    }
  }
  // for (let j = 0; j < WARMUP_ARRAY_LENGTH; j++) {
  //   if (resultIterateObjectMap[j].id !== resultIterateNativeMap[j].id ||
  //     resultIterateObjectMap[j].name !== resultIterateNativeMap[j].name) {
  //     console.log('Incorrect results on iterator warmup')
  //     process.exit(1)
  //   }
  // }

  // warmup delete
  clearObjectMap(objectMap, keys)
  clearNativeMap(nativeMap, keys)

  if (Object.keys(objectMap).length !== 0 || nativeMap.size !== 0) {
    console.log('Incorrect results on delete warmup')
    process.exit(1)
  }

}
console.log('Warm up completed!')

// experiment
console.log('Starting experiment...')

for (const arrayLength of EXPERIMENTS_ARRAY_LENGTHS) {
  let fillObjectMapTotal = 0
  let fillNativeMapTotal = 0

  let existsObjectMapTotal = 0
  let existsNativeMapTotal = 0

  let getObjectMapTotal = 0
  let getNativeMapTotal = 0

  let iterateObjectMapTotal = 0
  let iterateNativeMapTotal = 0

  let clearObjectMapTotal = 0
  let clearNativeMapTotal = 0

  for (let i = 0; i < EXPERIMENTS_COUNT; i++) {
    const keys = generateDefaultStringArray(arrayLength)
    const values = generateDefaultStringArray(arrayLength)
    const halfRandomKeys = generateHalfRandomArray(keys)

    gc()

    // fill
    let start = performance.now()
    const objectMap = fillObjectMap(keys, values)
    const fillObjectTimestamp = performance.now()
    const nativeMap = fillNativeMap(keys, values)
    const fillNativeTimestamp = performance.now()

    fillObjectMapTotal += fillObjectTimestamp - start
    fillNativeMapTotal += fillNativeTimestamp - fillObjectTimestamp

    const resultExistsObjectMap = Array(halfRandomKeys.length)
    const resultExistsNativeMap = Array(halfRandomKeys.length)

    gc()

    // exits
    start = performance.now()
    existsObjectMap(objectMap, halfRandomKeys, resultExistsObjectMap)
    const existsObjectTimestamp = performance.now()
    existsNativeMap(nativeMap, halfRandomKeys, resultExistsNativeMap)
    const existsNativeTimestamp = performance.now()

    for (let j = 0; j < arrayLength; j++) {
      if (resultExistsObjectMap[j] !== resultExistsNativeMap[j]) {
        console.log('Incorrect results on exists')
        process.exit(1)
      }
    }

    existsObjectMapTotal += existsObjectTimestamp - start
    existsNativeMapTotal += existsNativeTimestamp - existsObjectTimestamp

    gc()

    // get
    const resultGetObjectMap = Array(halfRandomKeys.length)
    const resultGetNativeMap = Array(halfRandomKeys.length)

    gc()

    start = performance.now()
    getObjectMap(objectMap, halfRandomKeys, resultGetObjectMap)
    const getObjectTimestamp = performance.now()
    getNativeMap(nativeMap, halfRandomKeys, resultGetNativeMap)
    const getNativeTimestamp = performance.now()

    for (let j = 0; j < arrayLength; j++) {
      if (resultGetObjectMap[j] !== resultGetNativeMap[j]) {
        console.log('Incorrect results on exists')
        process.exit(1)
      }
    }

    getObjectMapTotal += getObjectTimestamp - start
    getNativeMapTotal += getNativeTimestamp - getObjectTimestamp

    // iterate
    const resultIterateObjectMap = Array(nativeMap.size)
    const resultIterateNativeMap = Array(nativeMap.size)
    gc()

    start = performance.now()
    iterateThroughObjectMap(objectMap, nativeMap.size, resultIterateObjectMap)
    const iterateObjectTimestamp = performance.now()
    iterateThroughNativeMap(nativeMap, nativeMap.size, resultIterateNativeMap)
    const iterateNativeTimestamp = performance.now()

    for (let j = 0; j < nativeMap.size; j++) {
      if (resultIterateObjectMap[j][0] !== resultIterateNativeMap[j][0] ||
        resultIterateObjectMap[j][1] !== resultIterateNativeMap[j][1]) {
        console.log('Incorrect results on iterator')
        process.exit(1)
      }
    }

    iterateObjectMapTotal += iterateObjectTimestamp - start
    iterateNativeMapTotal += iterateNativeTimestamp - iterateObjectTimestamp

    // clear
    gc()

    start = performance.now()
    clearNativeMap(nativeMap, keys)
    const clearObjectTimestamp = performance.now()
    clearObjectMap(objectMap, keys)
    const clearNativeTimestamp = performance.now()

    if (Object.keys(objectMap).length !== 0 || nativeMap.size !== 0) {
      console.log('Incorrect results on delete warmup')
      process.exit(1)
    }

    clearObjectMapTotal += clearObjectTimestamp - start
    clearNativeMapTotal += clearNativeTimestamp - clearObjectTimestamp
  }

  console.group(`Map size: ${arrayLength}`)

  console.group('Filling the map with values')
  console.log(`object total: ${fillObjectMapTotal}`)
  console.log(`native total: ${fillNativeMapTotal}`)
  console.log(`diff: ${fillObjectMapTotal / fillNativeMapTotal}`)
  console.groupEnd()

  console.group('Checking if a value exists or not')
  console.log(`object total: ${existsObjectMapTotal}`)
  console.log(`native total: ${existsNativeMapTotal}`)
  console.log(`diff: ${existsObjectMapTotal / existsNativeMapTotal}`)
  console.groupEnd()

  console.group('Getting a particular element by key')
  console.log(`object total: ${getObjectMapTotal}`)
  console.log(`native total: ${getNativeMapTotal}`)
  console.log(`diff: ${getObjectMapTotal / getNativeMapTotal}`)
  console.groupEnd()

  console.group('Iterating through all elements')
  console.log(`object total: ${iterateObjectMapTotal}`)
  console.log(`native total: ${iterateNativeMapTotal}`)
  console.log(`diff: ${iterateObjectMapTotal / iterateNativeMapTotal}`)
  console.groupEnd()

  console.group('Clearing the map')
  console.log(`object total: ${clearObjectMapTotal}`)
  console.log(`native total: ${clearNativeMapTotal}`)
  console.log(`diff: ${clearObjectMapTotal / clearNativeMapTotal}`)
  console.groupEnd()

  console.groupEnd()
}


// Memory
console.group('Memory consumption')
for (const size of MEMORY_ARRAY_LENGTHS) {
  console.group(`Size: ${size}`)
  const keys = generateHashedStringArray(size)
  const values = generateDefaultStringArray(size)
  gc()


  let before = memoryUsedInKB()
  let map = fillObjectMap(keys, values)
  let after = memoryUsedInKB()
  console.log(`Object size:${Object.keys(map).length} Memory used: ${after - before} KB`)

  gc()

  before = memoryUsedInKB()
  map = fillNativeMap(keys, values)
  after = memoryUsedInKB()
  console.log(`Native size:${map.size} Memory used: ${after - before} KB`)
  console.groupEnd()
}
console.groupEnd()

console.log('Experiment completed!')
