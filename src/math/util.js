/**
 * @file Math helper constants and functions.
 */

// shorthands
const pi = Math.PI;
const pio2 = Math.PI / 2;
const twopi = 2 * Math.PI;
const sqrt2 = Math.sqrt(2);
const phi = 1.618033988749894;

/**
 * shorthand to construct Vector
 */
function v() { return new Vector(...arguments); }

/**
 * shorthand for Vector.polar
 */
function vp() { return Vector.polar(...arguments); }

/**
 *
 * @param {Vector} p1 g
 * @param {Vector} p2 g
 * @param {Vector} p3 g
 * @returns {Vector} g
 */
function clockwise(p1, p2, p3) {
  const val = (p2.y - p1.y) * (p3.x - p2.x) -
    (p2.x - p1.x) * (p3.y - p2.y);
  return (val > 0);
}

/**
 * Calculates the center point of a rectangle.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @returns {number[]} The [x, y] coordinates of the center point.
 */
function rectCenter(x, y, w, h) {
  return [x + w / 2, y + h / 2];
}

/**
 * Calculates the corners of a rectangle.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @returns {Vector[]} An array of xy coordinates for each corner.
 */
function rectCorners(x, y, w, h) {
  const result = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  return result.map((xy) => v(...xy));
}

/**
 * Divide a rectangle into smaller rectangles along a specified axis.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} n - The number of divisions.
 * @param {boolean} axis - The axis to divide along (true for horizontal, false for vertical).
 * @returns {number[][]} An array of rectangles represented by [x, y, w, h].
 */
function divideRect(x, y, w, h, n, axis) {
  const [start, len] = axis ? [y, h] : [x, w];
  const divLen = len / n;

  const result = [];
  for (let i = 0; i < n; i++) {
    const divStart = start + i * len / n;
    result.push(
      axis ? [x, divStart, w, divLen] :
        [divStart, y, divLen, h]
    );
  }

  return result;
}

/**
 * Divide a rectangle into rows.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} n - The number of rows.
 * @returns {number[][]} An array of rectangles represented by [x, y, w, h].
 */
function divideRows(x, y, w, h, n) {
  return divideRect(x, y, w, h, n, true);
}

/**
 * Divide a rectangle into columns.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} n - The number of columns.
 * @returns {number[][]} An array of rectangles represented by [x, y, w, h].
 */
function divideCols(x, y, w, h, n) {
  return divideRect(x, y, w, h, n, false);
}

/**
 * get padded rectangle.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} p - The padding amount.
 * @returns {number[]} The new rectangle coordinates and dimensions [x, y, w, h].
 */
function padRect(x, y, w, h, p) {
  return [x - p, y - p, w + 2 * p, h + 2 * p];
}

/**
 * Check if a point is inside a rectangle.
 * @param {Vector} p - The point in question.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @returns {boolean} True if the point is inside the rectangle, false otherwise.
 */
function vInRect(p, x, y, w, h) {
  const result = (p.x >= x) && (p.x <= (x + w)) && (p.y >= y) && (p.y <= (y + h));

  // console.log( p,x,y,w,h,result )
  return result;
}

/**
 * Check if a point is inside a rectangle.
 * @param {number} px
 * @param {number} py
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @returns {boolean} True if the point is inside the rectangle, false otherwise.
 */
function inRect(px, py, x, y, w, h) {
  return (px >= x) && (px <= (x + w)) && (py >= y) && (py <= (y + h));
}

/**
 * doesn't use procedural RNG
 * @param {number} min
 * @param {number} max
 * @returns {number} The random value.
 */
function safeRandRange(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * locate intersections between two circles
 * @param {number} x0 The center x coord of the first circle.
 * @param {number} y0 The center y coord of the first circle.
 * @param {number} r0 The radius of the first circle.
 * @param {number} x1 The center x coord of the second circle.
 * @param {number} y1 The center y coord of the second circle.
 * @param {number} r1 The radius of the second circle.
 */
function intersectionAngles(x0, y0, r0, x1, y1, r1) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Check for non-intersecting circles
  if (distance > r0 + r1) {
    // Circles do not intersect
    return 'out';
  }

  // Check for coinciding circles
  if (distance < Math.abs(r0 - r1)) {
    // One circle is entirely within the other
    return 'in';
  }

  // Calculate intersection angles
  const angle1 = Math.atan2(dy, dx);
  const angle2 = Math.acos((r0 * r0 + distance * distance - r1 * r1) / (2 * r0 * distance));

  const intersectionAngle1 = angle1 + angle2;
  const intersectionAngle2 = angle1 - angle2;

  return [intersectionAngle1, intersectionAngle2];
}

/**
 * non-negative mod
 * @param {number} a
 * @param {number} b
 */
function nnmod(a, b) {
  const r = a % b;
  return (r >= 0) ? r : r + b;
}

/**
 * Get equivalent angle in range [-pi,pi]
 * equivalent to given angle
 * @param {number} angle
 */
function cleanAngle(angle) {
  let a = nnmod(angle, twopi);
  if (a > Math.PI) {
    a = a - twopi;
  }
  if (a < -Math.PI) {
    a = a + twopi;
  }
  return a;
}

/**
 * Get value oscillate from 0 to 1
 * @param {number} period The desired duration in millisecs per cycle.
 * @param {number} offset The phase of the sin curve over global.t
 * @returns {number} The oscillating value.
 */
function pulse(period, offset = 0) {
  return (Math.sin(offset + global.t * twopi / period) + 1) / 2;
}

/**
 * Compute the average of two numbers.
 * @param {number} a
 * @param {number} b
 * @param {number} r
 * @returns {number} The average.
 */
function avg(a, b, r = 0.5) {
  return (a * (1.0 - r)) + (b * r);
}

/**
 * Compute midpoint of two vectors.
 * @param {Vector} a
 * @param {Vector} b
 * @param {number} r
 * @returns {Vector} The midpoint.
 */
function va(a, b, r = 0.5) {
  return v(avg(a.x, b.x, r), avg(a.y, b.y, r));
}

/**
 *
 * @param {Vector} p1
 * @param {Vector} p2
 * @param {Vector} p3
 * @returns {boolean} True if the points are clockwise.
 */
function arePointsClockwise(p1, p2, p3) {
  const crossProduct = (p1[0] - p2[0]) * (p3[1] - p2[1]) - (p1[1] - p2[1]) * (p3[0] - p2[0]);
  return crossProduct > 0;
}

/**
 * compute slope and intercept
 * euclidean line with points a and b
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number[]} The slope and intercept.
 */
function mb(a, b) {
  const slope = (b.y - a.y) / (b.x - a.x);
  const intercept = a.y - slope * a.x;
  return { slope, intercept };
}

/**
 * compute intersection point of two lines
 * the two lines are described by pairs of points
 * requires two lists, each containing 2 xy points
 * @param {Vector[]} ab1
 * @param {Vector[]} ab2
 * @returns {Vector} The intersection point.
 */
function intersection(ab1, ab2) {
  const mb1 = mb(...ab1);
  const mb2 = mb(...ab2);
  let x;
  let y;

  if (mb1.m === Infinity) {
    x = ab1[0].x;
    y = mb2.m * x + mb2.b;
  }
  else if (mb2.m === Infinity) {
    x = ab2[0].x;
    y = mb1.m * x + mb1.b;
  }
  else {
    // m1*x+b1 = m2*x+b2
    // m1*x-m2*x = b2-b1
    // x = (b2-b1)/(m1-m2)
    x = (mb2.b - mb1.b) / (mb1.m - mb2.m);
    y = mb1.m * x + mb1.b;
  }

  return new Vector(x, y);
}

/**
 * https://stackoverflow.com/a/2450976
 * @param {any[]} array
 */
function shuffle(array) {
  let currentIndex = array.length; let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
