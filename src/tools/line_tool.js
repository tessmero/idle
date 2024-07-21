
/**
 * @file LineTool.
 *
 * Click to spawn a ControlledSausageBody.
 */
class LineTool extends BodyTool {
  _icon = lineIcon;
  _tooltipText = 'build line';
  _cursorCenter = true;

  /**
   * Create a new body at the given position.
   * @param {Vector} p The position to center the new body at.
   */
  buildBody(p) {
    const len = SausageEdge.length();

    const d = sqrt2 * len / 2;
    const dd = v(d, d);

    return new ControlledSausageBody(this.sim,
      p.add(dd), p.sub(dd));
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
