
/**
 * @file BoxTool
 *
 * Click to spawn a BoxBuddy.
 */
class BoxTool extends BodyTool {
  _icon = boxIcon;
  _tooltipText = 'build box';
  _cursorCenter = true;

  #baseRad = 0.05;

  /**
   * Get a new BoxBuddy instance with the given position.
   * @param {Vector} p The position.
   */
  buildBody(p) {
    const rad = this.#baseRad * this.iconScale;
    return new BoxBuddy(this.sim, p, rad,
      this.screen.prebuiltBoxScreen);
  }

  /**
   * Compute the cost to build a new black box.
   */
  getCost() {

    // count previously built boxes
    const bods = this.sim.bodies;
    const boxes = [...bods].filter((b) => b instanceof BoxBuddy);
    const count = boxes.length;

    return ValueCurve.power(10000, 2.5).f(count);
  }

  /**
   *
   */
  getTutorial() {
    return new BoxToolTutorial();
  }
}
