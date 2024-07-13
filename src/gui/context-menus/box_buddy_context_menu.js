/**
 * @file BoxBuddyContextMenu gui element.
 * buddy context menu with internal screen display
 */
class BoxBuddyContextMenu extends BuddyContextMenu {

  /**
   * Extend buddy context menu by adding inner simulation display.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const boxBuddy = this._buddy;
    const s0 = this.square0;

    // position gui element to display inner screen
    const [vw, vh] = global.tutorialSimDims;
    const [cx, cy] = rectCenter(...s0);
    const r = [cx - vw / 2, cy - vh / 2, vw, vh];
    const gsp = new GuiScreenPanel(r, boxBuddy.innerScreen, true)
      .withTooltip('Click to enter');
    gsp.hoverable = true;
    gsp.hideInnerGui = true;
    gsp.click = () => boxBuddy.enter();

    // exempt inner screen from standard update-on-draw
    // instead it is updated persistently
    gsp.disableScreenUpdate = true;

    return [...super._buildElements(), gsp];
  }

  /**
   *
   */
  deleteEnabled() {
    return false;
  }
}
