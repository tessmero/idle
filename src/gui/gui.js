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
   * Set special one-time parameters, used for
   * box transition and story intervention.
   * @param {object} params The object with extra parameters.
   */
  setStateParams(params) {
    this._stateParams = params;
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
