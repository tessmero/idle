const _allTutorialScreens = {};

// base class for animation sequences
//
// involving a GuiParticleSim
// + animated recreation of the user's cursor/tool
class Tutorial {
  constructor() {
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

  getDuration() {
    return this.cursorPosKeyframes.at(-1)[0];
  }

  reset() {
    this.t = 0;
    this.finished = false;
  }

  getScreen() {
    const clazz = this.constructor;
    if (!(clazz in _allTutorialScreens)) {
      const sim = this.buildSim();
      const screen = new GameScreen(sim.rect, sim, null, this);
      _allTutorialScreens[clazz] = screen;
    }
    return _allTutorialScreens[clazz];
  }

  // should only be called in getScreen() ^
  buildSim() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  getTitle() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  getTestAssertions(_sim) {
    return [];
  }

  buildKeyFrames() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  update(dt) {

    // advance clock
    const t0 = this.t;
    this.t = this.t + dt;

    // return list of events since last update
    const t1 = this.t;
    return this.keyframes.filter((k) => (k[0] > t0) && (k[0] <= t1));
  }

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
