// Native map methods
// Filling the map with values
export function fillNativeMap (keys, values) {
  const result = new Map()

  for (let i = 0; i < keys.length; i++) {
    result.set(keys[i], values[i])
  }

  return result
}

// Checking if a value exists or not
export function existsNativeMap (nativeMap, keysToCheck, result) {
  for (let i = 0; i < keysToCheck.length; i++) {
    result[i] = nativeMap.has(keysToCheck[i])
  }
}

// Getting a particular element by key
export function getNativeMap (nativeMap, keysToGet, result) {
  for (let i = 0; i < keysToGet.length; i++) {
    result[i] = nativeMap.get(keysToGet[i])
  }
}

// Iterating through all elements
export function iterateThroughNativeMap (nativeMap, size, result) {
  let i = 0

  for (const [key, value] of nativeMap.entries()) {
    result[i] = [key, value]
    i++
  }

}

// Clearing the map
export function clearNativeMap (nativeMap, keysToDelete) {
  for (let i = 0; i < keysToDelete.length; i++) {
    nativeMap.delete(keysToDelete[i])
  }
}