/**
 * object to store performance
 * stats accumulated over time
 *
 * instance assigned in setup.js
 *   global.logPerformanceStats
 */
let _LogPerformanceStatsConstructed = false;

/**
 *
 */
class LogPerformanceStats {

  /**
   * called once in setup.js
   */
  constructor() {
    if (_LogPerformanceStatsConstructed) {
      throw new Error(`${this.constructor} constructed mutiple times`);
    }
    _LogPerformanceStatsConstructed = true;

    this.constructedScreens = new Map();
    this.totalFloat32Alloc = 0;
  }

  /**
   * Called in FloatArray constructor.
   * @param n Size of Float32Array allocated.
   */
  submitNewArray(n) {
    this.totalFloat32Alloc = this.totalFloat32Alloc + n;
  }

  /**
   * Called in GameScreen constructor.
   * @param {string} key A readable unique title.
   * @param {GameScreen} screen The new instance to register.
   */
  submitNewScreen(key, screen) {
    const as = this.constructedScreens;
    if (as.has(key)) {
      throw new Error(`screen (${key}) constructed multiple times`);
    }
    screen.key = key;
    as.set(key, screen);
  }
}
