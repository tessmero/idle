
/**
 * @file ExpTool Click a buddy to grant free exp in sandbox mode.
 */
class ExpTool extends Tool {
  _icon = increaseIcon;
  _tooltipText = 'give EXP';
  _cursorCenter = true;

  // amount to increase exp each click
  #amt = 120;

  /**
   *
   */
  getTutorial() {
    return new ExpToolTutorial();
  }

  /**
   * Click a buddy to increase their exp.
   * @param {Vector} p The position of the mouse.
   */
  mouseDown(p) {
    const sim = this.sim;

    // needs cleanup
    // copy default tool grabbing control point
    sim.updateControlPointHovering(p);
    const held = sim.hoveredControlPoint;
    const buddy = sim.findRepresentativeBody(held);
    if (buddy instanceof Buddy) {
      buddy.gainExp(this.#amt);
    }

    // show context menu
    sim.selectedBody = buddy;
  }
}
