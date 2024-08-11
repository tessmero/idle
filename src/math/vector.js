/**
 * @file Vector immutable 2D point.
 */
class Vector {
  static nConstructed = 0;

  #x;
  #y;

  /**
   * Create a new vector with given cartesian coordinates.
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   */
  constructor(x, y) {
    Vector.nConstructed = Vector.nConstructed + 1;

    this.#x = x;
    this.#y = y;
  }

  /**
   * Create a new vector based on polar coordinates.
   * @param {number} angle The angle compared to the origin.
   * @param {number} magnitude The distance from the origin.
   */
  static polar(angle, magnitude) {
    const x = magnitude * Math.cos(angle);
    const y = magnitude * Math.sin(angle);
    return new Vector(x, y);
  }

  /**
   * Get x and y coordinates.
   */
  xy() {
    return [this.#x, this.#y];
  }

  /**
   * Get the rotated copy of this vector.
   * @param {number} angle The angle to rotate around the origin.
   */
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector(this.#x * cos - this.#y * sin, this.#y * cos + this.#x * sin);
  }

  /**
   * @returns {number} This vector's angle compared to the origin.
   */
  getAngle() {
    return Math.atan2(this.#y, this.#x);
  }

  /**
   * @returns {number} The square of this vector's magnitude.
   */
  getD2() {
    return Math.pow(this.#x, 2) + Math.pow(this.#y, 2);
  }

  /**
   * @returns {number} This vector's distance from the origin.
   */
  getMagnitude() {
    return Math.sqrt(this.getD2());
  }

  /**
   * @returns {Vector} The unit vector with this vector's angle and length 1.
   */
  normalize() {
    return this.mul(1.0 / this.getMagnitude());
  }

  /**
   * Get the sum of this vector and another vector.
   * @param {Vector} o The other vector.
   * @returns {Vector} The sum of the two vectors.
   */
  add(o) {
    return new Vector(this.#x + o.#x, this.#y + o.#y);
  }

  /**
   * Get the difference between this vector and another vector.
   * @param {Vector} o The other vector.
   * @returns {Vector} The difference after subtracting the other vector.
   */
  sub(o) {
    return new Vector(this.#x - o.#x, this.#y - o.#y);
  }

  /**
   * Multiply this vector by a scalar.
   * @param {number} k The scalar coefficient.
   * @returns {Vector} The vector with x and y multiplied.
   */
  mul(k) {
    return new Vector(this.#x * k, this.#y * k);
  }

  /**
   * X cannot change.
   */
  set x(_x) { throw new Error('not allowed'); }

  /**
   *
   */
  get x() { return this.#x; }

  /**
   * Y cannot change.
   */
  set y(_y) { throw new Error('not allowed'); }

  /**
   *
   */
  get y() { return this.#y; }
}
