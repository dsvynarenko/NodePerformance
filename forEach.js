// constants
const WARM_UP_CYCLES = 100
const WARMUP_ARRAY_LENGTH = 1_000_000
const EXPERIMENTS_ARRAY_LENGTHS = [1_000, 10_000, 100_000, 1_000_000, 2_000_000, 5_000_000]
const EXPERIMENTS_COUNT = 20

// generate random values
function getRandomInRange (min, max) {
  return Math.random() * (max - min) + min
}

// generate test array
function generateTestArray (count) {
  const res = Array(count)

  for (let i = 0; i < count; i++) {
    res[i] = getRandomInRange(-20000, 20000)
  }

  return res
}

// Sum in functional approach
function sumFunctional (arr) {
  let sum = 0

  arr.forEach((n) => {
    sum += n
  })

  return sum
}

// Sum in imperative approach
function sumImperative (arr) {
  let sum = 0

  for (const n of arr) {
    sum += n
  }

  return sum
}

// warm-up
// console.log("Warming up...");
for (let i = 0; i < WARM_UP_CYCLES; i++) {
  const testData = generateTestArray(WARMUP_ARRAY_LENGTH)
  const resultFunctional = sumFunctional(testData)
  const resultImperative = sumImperative(testData)
  const correctResult = resultFunctional === resultImperative

  if (!correctResult) {
    console.log('Incorrect results on warmup')
  }
}
console.log('Warm up completed!')

// experiment
console.log('Starting experiment...')

for (const arrayLength of EXPERIMENTS_ARRAY_LENGTHS) {
  let sumFunctionalTotal = 0
  let sumImperativeTotal = 0
  let correctResultTotal = true

  for (let i = 0; i < EXPERIMENTS_COUNT; i++) {
    const testData = generateTestArray(arrayLength)
    const firstTimeStamp = performance.now()
    const resultFunctional = sumFunctional(testData)
    const secondTimeStamp = performance.now()
    const resultImperative = sumImperative(testData)
    const thirdTimeStamp = performance.now()
    const correctResult = resultFunctional === resultImperative

    sumFunctionalTotal += secondTimeStamp - firstTimeStamp
    sumImperativeTotal += thirdTimeStamp - secondTimeStamp
    correctResultTotal &= correctResult

  }

  console.group(`Array size: ${arrayLength}`)
  console.log(`sumFunctional() total: ${sumFunctionalTotal}`)
  console.log(`sumImperative() total: ${sumImperativeTotal}`)
  console.log(`diff: ${sumFunctionalTotal / sumImperativeTotal}`)
  console.log(`isCorrect: ${correctResultTotal ? 'true' : 'false'}`)
  console.groupEnd()
}

console.log('Experiment completed!')
