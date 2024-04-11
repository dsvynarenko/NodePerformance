import crypto from 'crypto'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

// generate random values
export function getRandomInRange (min, max) {
  return Math.random() * (max - min) + min
}

// generate random string for
export function getRandomString () {
  const length = getRandomInRange(3, 14)
  let result = ''

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

// generate hash string for
export function getRandomHexString () {
  return crypto.randomBytes(32).toString('hex')
}