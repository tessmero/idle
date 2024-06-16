/**
 * @file random number generator utility functions.
 *
 * provides helpers like resetRand() and rand()
 * to reliably reproduce random sequences
 */

let rand;

/* eslint-disable */
//https://stackoverflow.com/a/47593316
function cyrb128(str) {
  let h1 = 1779033703; let h2 = 3144134277;
  let h3 = 1013904242; let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
}

function sfc32(a, b, c, d) {
  return function() {
    a = a >>> 0; b = b >>> 0; c = c >>> 0; d = d >>> 0;
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
}
/* eslint-enable */

function randomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result = result + characters.charAt(Math.floor(Math.random() * charactersLength));
    counter = counter + 1;
  }
  return result;
}

/**
 * @returns {number[]} A seed suitable for resetRand.
 */
function randomSeed() {
  return cyrb128(randomString(10));
}

/**
 *
 * @param {number[]} seed
 */
function resetRand(seed = null) {
  let s = seed;
  if (s === null) {
    s = randomSeed();
  }
  rand = sfc32(...s);
}

/**
 *
 * @param {number} min
 * @param {number} max
 */
function randRange(min, max) {
  return min + rand() * (max - min);
}

/**
 * @param {object[]} options
 */
function randChoice(options) {
  return options[Math.floor(Math.random() * options.length)];
}
