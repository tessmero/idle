/**
 * a wrapper for a set of small integers
 * and corresponding boolean array
 */
class IntSet {
  /**
   *
   * @param n
   * @param fill
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
   * get number of true elements
   */
  size() {
    return this.set.size;
  }

  /**
   * get first index matching b
   * @param b target value
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
   *
   * @param i
   */
  has(i) {
    return this.bools[i];
  }

  /**
   *
   * @param b
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
   *
   * @param i
   */
  add(i) {
    this.bools[i] = true;
    this.set.add(i);
  }

  /**
   *
   * @param i
   */
  delete(i) {
    this.bools[i] = false;
    this.set.delete(i);
  }
}
