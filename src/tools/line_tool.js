
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
    return new ControlledSausageBody(this.sim, p);
  }

  /**
   *
   */
  getCost() {

    // count previously built lines
    const bods = this.sim.bodies;
    const lineBods = [...bods].filter((b) => b instanceof ControlledSausageBody);
    const count = lineBods.length;

    return ValueCurve.fromParams('power', 50, 10).f(count);
  }

  /**
   *
   */
  getTutorial() {
    return new LineToolTutorial();
  }

}
