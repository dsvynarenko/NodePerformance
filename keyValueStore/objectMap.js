// Object methods
// Filling the map with values
export function fillObjectMap (keys, values) {
  const result = {}

  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = values[i]
  }

  return result
}

// Checking if a value exists or not
export function existsObjectMap (objectMap, keysToCheck, result) {
  for (let i = 0; i < keysToCheck.length; i++) {
    result[i] = objectMap.hasOwnProperty(keysToCheck[i])
  }
}

// Getting a particular element by key
export function getObjectMap (objectMap, keysToGet, result) {
  for (let i = 0; i < keysToGet.length; i++) {
    result[i] = objectMap[keysToGet[i]]
  }
}

// Iterating through all elements
export function iterateThroughObjectMap (objectMap, size, result) {
  let i = 0

  for (const [key, value] of Object.entries(objectMap)) {
    result[i] = [key, value]
    i++
  }
}

// Clearing the map
export function clearObjectMap (objectMap, keysToDelete) {
  for (let i = 0; i < keysToDelete.length; i++) {
    delete objectMap[keysToDelete[i]]
  }
}
