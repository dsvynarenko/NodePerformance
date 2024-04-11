import { getRandomHexString, getRandomString, getRandomInRange } from '../random.js'

// generate default string array
export function generateDefaultStringArray (count) {
  const res = Array(count)

  for (let i = 0; i < count; i++) {
    res[i] = getRandomString()
  }

  return res
}

// generate hashed string array
export function generateHashedStringArray (count) {
  const res = Array(count)

  for (let i = 0; i < count; i++) {
    res[i] = getRandomHexString()
  }

  return res
}

// generate random objects array
export function generateObjectArray (count) {
  const res = Array(count)

  for (let i = 0; i < count; i++) {
    res[i] = {
      id: getRandomInRange(0, 1000),
      name: getRandomString(),
      passHash: getRandomHexString()
    }
  }

  return res
}

export function generateHalfRandomArray (array) {
  const result = Array(array.length)

  for (let i = 0; i < array.length; i++) {
    result[i] = Math.random() > 0.5 ? array[i] : getRandomString()
  }

  return result
}

export function memoryUsedInKB () {
  return process.memoryUsage().heapTotal / 1024
}