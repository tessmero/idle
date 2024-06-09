/**
 * @file ValueCurve object type for math functions
 * used to compute in-game costs and bonuses.
 */
class ValueCurve {

  /**
   * f(i) => value after i upgrades
   * @param {Function} f The math function f(i).
   */
  constructor(f) {
    this.f = f;
  }

  /**
   * Convenience function to construct linear ValueCurve.
   * @param {number} m The slope.
   * @param {number} b The intercept.
   */
  static linear(m, b) {
    return new ValueCurve(
      (i) => m * i + b
    );
  }

  /**
   * Convenience function to construct power ValueCurve.
   * @param {number} start
   * @param {number} scale
   */
  static power(start, scale) {
    return new ValueCurve(
      (i) => start * Math.pow(scale, i)
    );
  }
}
