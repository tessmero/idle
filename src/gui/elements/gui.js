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
   * Construct Gui with given rectangle.
   * @param {number[]} rect The rectangle to align elements in.
   * @param  {object} params The gui element parameters.
   */
  constructor(rect, params = {}) {
    super(rect, params);
  }

  /**
   * Set special one-time parameters, used for
   * box transition and story intervention.
   * @param {object} stateParams The object with extra parameters.
   */
  setStateParams(stateParams) {
    this._stateParams = stateParams;
  }

  /**
   * return Gui instance to draw behind this
   * e.g. draw hud behind upgrade menu
   */
  getBackgroundGui() {
    return null;
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
