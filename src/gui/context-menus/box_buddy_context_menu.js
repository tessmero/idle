/**
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
    const [_x, _y, w, h] = boxBuddy.innerScreen.rect;
    const [cx, cy] = rectCenter(...s0);
    const r = [cx - w / 2, cy - h / 2, w, h];
    const gsp = new GuiScreenPanel(r, boxBuddy.innerScreen);

    // exempt inner screen from standard update-on-draw
    // instead it is updated persistently
    gsp.disableScreenUpdate = true;

    this.children.push(gsp);
  }
}
