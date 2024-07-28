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
   * Construct value curve based on type/params
   * 'linear',slope,intercept or 'power',start,scale
   * @param {string} type
   * @param {...number} params
   */
  static fromParams(type, ...params) {
    switch (type) {
    case 'linear':
      const [m, b] = params;
      return new ValueCurve(
        (i) => m * i + b
      );

    default:
    case 'power':
      const [start, scale] = params;
      return new ValueCurve(
        (i) => start * Math.pow(scale, i)
      );
    }
  }
}
