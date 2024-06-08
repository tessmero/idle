/**
 * @file BoxBuddyContextMenu gui element.
 * buddy context menu with internal screen display
 */
class BoxBuddyContextMenu extends BuddyContextMenu {

  /**
   *
   * @param rect
   * @param s0
   * @param s1
   * @param boxBuddy
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
