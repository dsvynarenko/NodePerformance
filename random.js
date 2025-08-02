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

export function getLargeArray(size) {
  return Array.from({ length: size }, (_, i) => Array.from({ length: 10 }, (_, j) => i * 10 + j));
}

export function getObjectArray(size) {
  return Array.from({ length: size }, (_, i) => ({
    id: i,
    name: `User${i}`,
    email: `user${i}@example.com`,
    age: 20 + (i % 50),
    status: i % 2 === 0 ? 'active' : 'inactive',
    x: i,
    y: i * 2,
    z: i * 3,
    a: i * 0.1,
    b: i * 0.2,
    c: `string${i}`,
    d: `value${i}`,
    e: i % 10,
    f: i % 5,
    g: i % 3,
    h: i % 7,
    details: {
      metadata: {
        id: i,
        created: Date.now()
      }
    }
  }));
}

export function getDifferentObjectArray(size) {
  return Array.from({ length: size }, (_, i) => {
    if (i % 3 === 0) {
      return { a: 1, b: 2, c: 'x', d: null, e: 5, f: 6, g: 7, h: 8 };
    }
    if (i % 3 === 1) {
      return { a: 2, b: 3, c: 'y', d: 'zzz', f: 6, g: 7, h: 8, e: 5 }; // інший порядок
    }
    return { a: 2, c: 'y', b: 3, g: 7, h: 8, e: 5, d: 'zzz', f: 6 }; // інший порядок
  });
}
