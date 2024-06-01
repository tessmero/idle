
/**
 * @file LineTool.
 *
 * Click to spawn a ControlledSausageBody.
 */
class LineTool extends BodyTool {

  /**
   *
   * @param sim
   * @param lineLength
   */
  constructor(sim, lineLength = 0.1) {
    super(sim, lineIcon, 'build line', true);

    this.lineRadius = 2e-2; // radius of caps (half of thickness)
    this.lineLength = lineLength;
  }

  //
  /**
   * implement BodyTool
   * @param p
   */
  buildBody(p) {
    let d = sqrt2 * this.lineLength / 2;
    d = v(d, d);
    return new ControlledSausageBody(this.sim,
      p.add(d), p.sub(d),
      this.lineRadius);
  }

  /**
   *
   */
  getCost() {

    // count previously built lines
    const bods = this.sim.bodies;
    const lineBods = [...bods].filter((b) => b instanceof ControlledSausageBody);
    const count = lineBods.length;

    return ValueCurve.power(50, 10).f(count);
  }

  /**
   *
   */
  getTutorial() {
    return new LineToolTutorial();
  }

}
