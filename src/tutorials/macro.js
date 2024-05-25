
/**
 * base class for animation sequence
 * that emulates user actions
 */
class Macro {

  /**
   * Construct new tutorial based on
   * implemented buildKeyFrames() method
   * @param title
   */
  constructor(title) {
    this._title = title;
    this.reset();

    const kf = this.buildKeyframes();
    this.keyframes = kf;

    const grabRad = 0.001;
    const t = new DefaultTool(null, grabRad);
    this.defaultTool = t;
    this.primaryTool = t;
    this.tool = t;

    // extract cursor position data
    this.cursorPosKeyframes = kf.filter((e) => e[1] === 'pos');
  }

  /**
   * return a list of [time,action...] animation frames
   *
   * times are millisecs since start of animation
   * 'pos' action accepts a location vector, where
   * x/y coords are in fractions of screen size
   *
   * move mouse diagonally across screen
   * return [ [0,'pos',v(0,0)], [1000,'pos',v(1,1)] ]
   *
   *
   *
   */
  buildKeyFrames() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Default duration is computed based on
   * implemented buildKeyFrames() method
   */
  getDuration() {
    return this.cursorPosKeyframes.at(-1)[0];
  }

  /**
   *
   */
  reset() {
    this.t = 0;
    this.finished = false;
  }

  /**
   * get title string
   */
  getTitle() {
    return this._title;
  }

  /**
   *
   * @param dt
   */
  update(dt) {

    // advance clock
    const t0 = this.t;
    this.t = this.t + dt;

    // return list of events since last update
    const t1 = this.t;
    return this.keyframes.filter((k) => (k[0] > t0) && (k[0] <= t1));
  }

  /**
   *
   */
  getCursorPos() {

    const t = this.t;
    const kf = this.cursorPosKeyframes;

    if (t < kf[0][0]) { return kf[0][2]; } // return first position

    // iterate over position keyframes
    for (let i = 1; i < kf.length; i++) {
      const t1 = kf[i][0];

      if (t < t1) {

        // return interpolated position
        const t0 = kf[i - 1][0];
        const r = (t - t0) / (t1 - t0);
        return va(kf[i - 1][2], kf[i][2], r);
      }
    }

    this.finished = true;
    return kf.at(-1)[2]; // return last position
  }
}
