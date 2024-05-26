
/**
 *
 */
class BoxTool extends BodyTool {

  /**
   *
   * @param sim
   */
  constructor(sim) {
    super(sim, 'black box', boxIcon);

    this.cursorCenter = true; // tool.js
    this.boxRadius = 0.05;
  }

  /**
   *
   * @param p
   */
  buildBody(p) {
    return new BoxBuddy(this.sim, p, this.boxRadius);
  }

  /**
   *
   */
  getCost() {

    // count previously built boxes
    const bods = this.sim.getBodies();
    const boxes = [...bods].filter((b) => b instanceof BoxBuddy);
    const count = boxes.length;

    return ValueCurve.power(100, 2.5).f(count);
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
