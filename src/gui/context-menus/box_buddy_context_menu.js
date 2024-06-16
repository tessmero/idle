/**
 * @file BoxBuddyContextMenu gui element.
 * buddy context menu with internal screen display
 */
class BoxBuddyContextMenu extends BuddyContextMenu {

  /**
   *
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {number[]} s0 The first content square to align elements in.
   * @param {number[]} s1 The second content square to align elements in.
   * @param {Body} boxBuddy The BoxBuddy instance to look into.
   */
  constructor(rect, s0, s1, boxBuddy) {
    super(rect, s0, s1, boxBuddy);

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

    this.addChild(gsp);
  }
}
