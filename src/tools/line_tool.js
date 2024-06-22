
/**
 * @file LineTool.
 *
 * Click to spawn a ControlledSausageBody.
 */
class LineTool extends BodyTool {
  _icon = lineIcon;
  _tooltipText = 'build line';
  _cursorCenter = true;

  #baseLen = 0.1;
  #baseRad = 2e-2;

  /**
   * Create a new body at the given position.
   * @param {Vector} p The position to center the new body at.
   */
  buildBody(p) {
    const scale = this.iconScale;
    const len = this.#baseLen * scale;
    const rad = this.#baseRad * scale;

    const d = sqrt2 * len / 2;
    const dd = v(d, d);

    return new ControlledSausageBody(this.sim,
      p.add(dd), p.sub(dd), rad);
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
