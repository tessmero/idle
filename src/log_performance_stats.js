/**
 * @file LogPerformanceStats object type.
 *
 * object to accumulate performance stats over time.
 *
 * constructed once in setup.js
 * instance is global.logPerformanceStats
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
   * @param {number} n Size of Float32Array allocated.
   */
  submitNewArray(n) {
    this.totalFloat32Alloc = this.totalFloat32Alloc + n;
  }

  /**
   * Called in GameScreen constructor.
   * @param {GameScreen} screen The new instance to register.
   */
  submitNewScreen(screen) {
    const key = screen.titleKey;
    const as = this.constructedScreens;
    if (as.has(key)) {
      throw new Error(`screen (${key}) constructed multiple times`);
    }
    as.set(key, screen);
  }
}
