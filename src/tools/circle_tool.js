
/**
 * @file CircleTool
 * Click to spawn a CircleBuddy.
 */
class CircleTool extends BodyTool {

  /**
   *
   * @param sim
   */
  constructor(sim) {
    super(sim, circleIcon, 'build circle', true);
    this.circleRadius = 0.1;
  }

  /**
   * Get a new CircleBuddy instance at the given position.
   * @param {Vector} p The position.
   */
  buildBody(p) {
    return new CircleBuddy(this.sim, p, this.circleRadius);
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

  /**
   *
   * @param _p
   */
  mouseMove(_p) {}

  /**
   *
   * @param _p
   */
  mouseUp(_p) {}
}
