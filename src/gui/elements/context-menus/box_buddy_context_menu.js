/**
 * @file BoxBuddyContextMenu gui element.
 * buddy context menu with internal screen display
 */
class BoxBuddyContextMenu extends BuddyContextMenu {

  /**
   *
   */
  deleteEnabled() {
    return false;
  }

  /**
   * Replace default art element with inner screen display.
   */
  _buildArtElem() {
    const boxBuddy = this._buddy;
    const rect = this._layout.artArea;

    const gsp = new GuiScreenPanel(rect, {
      innerScreen: boxBuddy.innerScreen,
      allowScaling: true,
      tooltip: 'Click to enter',
      hoverable: true,
      hideInnerGui: true,
    });
    gsp.click = () => boxBuddy.enter();

    // exempt inner screen from standard update-on-draw
    // instead it is updated persistently
    gsp.disableScreenUpdate = true;

    return gsp;
  }

}
