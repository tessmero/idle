/**
 * @file IntSet object type
 *
 * wrapper for a set of small integers
 * and corresponding boolean array
 */
class IntSet {

  /**
   *
   * @param {number} n The fixed size of this set.
   * @param {boolean} fill True if all integers  [0...this.n)
   *                  should be included initially
   */
  constructor(n, fill = false) {
    this.n = n;
    this.bools = new Array(n).fill(fill);

    this.set = new Set();
    if (fill) {
      for (let i = 0; i < n; i++) { this.set.add(i); }
    }
  }

  /**
   * Count how many integers are included in this set.
   */
  size() {
    return this.set.size;
  }

  /**
   * Get smallest integer with the given state.
   * @param {boolean} b True to find first included integer,
   *                    or false to find first NOT included integer.
   */
  find(b) {
    for (let i = 0; i < this.n; i++) {
      if (this.bools[i] === b) { return i; }
    }
    return -1;
  }

  /**
   *
   */
  clear() { this.fill(false); }

  /**
   * Check if the given integer is in this set.
   * @param {number} i The integer in question.
   */
  has(i) {
    return this.bools[i];
  }

  /**
   * Completely fill or clear this set.
   * @param {boolean} b True to add integers [0...this.n)
   *                    or false to remove all.
   */
  fill(b) {
    for (let i = 0; i < this.n; i++) {
      if (b) {
        this.add(i);
      }
      else {
        this.delete(i);
      }
    }
  }

  /**
   * Add an integer to this set.
   * Does nothing if it was already included.
   * @param {number} i The integer in [0...this.n)
   */
  add(i) {
    this.bools[i] = true;
    this.set.add(i);
  }

  /**
   * Remove an integer from this set.
   * Does nothing if it was already removed.
   * @param {number} i The integer in [0...this.n)
   */
  delete(i) {
    this.bools[i] = false;
    this.set.delete(i);
  }
}
