/**
 * @file Gui base class for top-level gui groups
 * associated with game states e.g. the start menu.
 */
class Gui extends CompositeGuiElement {

  /**
   *
   * @param title
   * @param {...any} p
   */
  constructor(title, ...p) {
    super(...p);
    this.title = title;
  }

  /**
   *
   */
  getScreenEdgesForContextMenu() {
    const rect = [...global.rootScreen.rect]; // [...this.rect];
    const topMargin = 0.1;
    const bottomMargin = 0.1;
    const sideMargin = 0.1;
    rect[1] = rect[1] + topMargin;
    rect[3] = rect[3] - (topMargin + bottomMargin);
    rect[0] = rect[0] + sideMargin;
    rect[2] = rect[2] - 2 * sideMargin;
    return rect;
  }

  /**
   * build list of GuiElement instances
   * @param _screen
   */
  buildElements(_screen) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  // return Gui instance to draw behind this
  // e.g. draw hud behind upgrade menu
  /**
   *
   */
  getBackgroundGui() {
    return null;
  }

  /**
   * return true to prevent clearing screen
   * used for some screen transition animations
   */
  stopScreenClear() {
    return false;
  }

  /**
   * Called in game_state_manager.js
   */
  open() {}

  /**
   * Called in game_state_manager.js
   */
  close() {}

  /**
   *
   * @param {...any} p
   */
  update(...p) {
    global.livePerformanceStats.flagGui(this, 'updated');
    super.update(...p);
  }

  /**
   *
   * @param {...any} p
   */
  draw(...p) {
    global.livePerformanceStats.flagGui(this, 'drawn');
    super.draw(...p);
  }
}
