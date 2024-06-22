
/**
 * @file CircleTool
 * Click to spawn a CircleBuddy.
 */
class CircleTool extends BodyTool {
  _icon = circleIcon;
  _tooltipText = 'build circle';
  _cursorCenter = true;

  #baseRad = 0.1;

  /**
   * Get a new CircleBuddy instance at the given position.
   * @param {Vector} p The position.
   */
  buildBody(p) {
    const rad = this.#baseRad * this.iconScale;
    return new CircleBuddy(this.sim, p, rad);
  }

  /**
   * Compute the cost to build a new CircleBuddy.
   */
  getCost() {

    // count previously built circles
    const bods = this.sim.bodies;
    const circles = [...bods].filter((b) => b instanceof CircleBuddy);
    const count = circles.length;

    return ValueCurve.power(100, 2.5).f(count);
  }

  /**
   *
   */
  getTutorial() {
    return new CircleToolTutorial();
  }
}
