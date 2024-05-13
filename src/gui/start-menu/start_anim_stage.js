// base class for short section of full-screen animation
// involved in the (star tmenu -> playing) transition sequence
class StartAnimStage {

  constructor() {
    this.t = 0;
    this.duration = 1000;
  }

  // prevent canvas from being cleared in draw.js
  stopCanvasClear() {
    return false;
  }

  draw(_g, _rect) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
