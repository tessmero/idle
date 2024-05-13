const _allTestScreens = {};

// integration test for a simulation
class Test {

  getScreen() {
    const clazz = this.constructor;
    if (!(clazz in _allTestScreens)) {
      _allTestScreens[clazz] = this.buildScreen();
    }
    return _allTestScreens[clazz];
  }

  buildScreen() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  getTitle() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  getDuration() {
    const ta = this.getTestAssertions();
    if (ta.length === 0) {
      return 5000;
    }
    return 100 + ta.at(-1)[0]; // time of last assertion
  }

  getTestAssertions(_sim) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  static anglesEqual(a, b) {
    const diff = Math.abs(cleanAngle(a - b));
    return diff < 1e-2; // radians
  }

  static vectorsEqual(a, b, epsilon = 1e-2) {
    const d = a.sub(b);
    return d.getMagnitude() < epsilon;
  }

  // get relative position
  // return value  v(.5,.5) means center of sim
  static relPos(sim, actualPos) {
    const r = sim.rect;
    return v(
      (actualPos.x - r[0]) / r[2],
      (actualPos.y - r[1]) / r[3]
    );
  }
}
