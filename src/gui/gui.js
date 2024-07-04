/**
 * @file Gui base class for top-level gui groups
 * associated with game states e.g. the start menu.
 */
class Gui extends CompositeGuiElement {

  /**
   * Unique title to be submitted to performance log
   * @abstract
   * @type {string}
   */
  title;

  /**
   * Construct array of GuiElement instances for the given game screen.
   * @abstract
   * @param {GameScreen} _screen The screen in need of gui elements.
   */
  buildElements(_screen) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Set special one-time parameters, used for
   * box transition and story intervention.
   * @param {object} params The object with extra parameters.
   */
  setStateParams(params) {
    this._stateParams = params;
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
   * return Gui instance to draw behind this
   * e.g. draw hud behind upgrade menu
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
   * @param {object} g The graphics context
   */
  draw(g) {
    global.livePerformanceStats.flagGui(this, 'drawn');
    super.draw(g);
  }
}
