
/**
 * @file EmitterTool for sandbox mode.
 *
 * Click to spawn an Emitter with control points.
 */
class EmitterTool extends BodyTool {
  _icon = lineIcon;
  _tooltipText = 'build emitter';
  _cursorCenter = true;

  /**
   * Create a new body at the given position.
   * @param {Vector} p The position to center the new body at.
   */
  buildBody(p) {
    return new DefaultControlFrame(new Emitter(this.sim, p));
  }

}
