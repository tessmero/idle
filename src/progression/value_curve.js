/**
 *
 */
class ValueCurve {

  // f(i) => value after i upgrades
  /**
   *
   * @param f
   */
  constructor(f) {
    this.f = f;
  }

  /**
   *
   * @param m
   * @param b
   */
  static linear(m, b) {
    return new ValueCurve(
      (i) => m * i + b
    );
  }

  /**
   *
   * @param start
   * @param scale
   */
  static power(start, scale) {
    return new ValueCurve(
      (i) => start * Math.pow(scale, i)
    );
  }
}
