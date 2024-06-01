
/**
 * @file BoxTool
 *
 * Click to spawn a BoxBuddy.
 */
class BoxTool extends BodyTool {

  /**
   *
   * @param sim
   */
  constructor(sim) {
    super(sim, boxIcon, 'build black box', true);

    this.boxRadius = 0.05;
  }

  /**
   * Get a new BoxBuddy instance with the given position.
   * @param {Vector} p The position.
   */
  buildBody(p) {
    return new BoxBuddy(this.sim, p, this.boxRadius);
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
