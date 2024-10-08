/**
 * @file Start Transition GUI
 * Top-level gui container/placeholder that is active
 * during transition from start menu to game
 */
class StartTransitionGui extends Gui {
  _titleKey = 'start-transition-gui';

  /**
   * Construct Gui with given rectangle.
   * @param {number[]} rect The rectangle to align elements in.
   * @param  {object} params The gui element parameters.
   */
  constructor(rect, params = {}) {
    super(rect, params);

    // initiate fade out animation if necessary
    if (!(this._startTransFadeOut || this._startTransMid || this._startTransFadeIn)) {
      this._startTransFadeOut = FadeOut.random();
    }
  }

  /**
   * This has no children, instead we extend draw() method in this file.
   * @returns {GuiElement[]} An empty array indicating no gui elements.
   */
  _buildElements() {
    return [];
  }

  /**
   * Show the old screen behind this transition effect.
   * @returns {Gui} The gui to display in the background.
   */
  getBackgroundGui() {
    const bgState = this._startTransFadeOut ?
      GameStates.startMenu : GameStates.playing;
    if (!this.screen) { return null; }
    return this.screen.stateManager.getGuiForState(bgState);
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);
    const fs = [this._startTransFadeOut, this._startTransMid, this._startTransFadeIn];
    fs.forEach((f) => { if (f) { f.draw(g, this.rect); } });
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   */
  update(dt) {
    super.update(dt);

    // identify current animation stage
    const fo = this._startTransFadeOut;
    const fm = this._startTransMid;
    const fi = this._startTransFadeIn;
    const f = fo ? fo : (fm ? fm : fi);

    if (!f) {
      return;
    }

    // advance current animation stage
    f.t = f.t + dt;

    // check if current stage ended
    if (f.t > f.duration) {
      if (fo) {

        // fade out complete
        // initiate middle animation
        this._startTransFadeOut = null;
        this._startTransMid = new StartMessage();
        this._startTransFadeIn = null;

      }
      else if (fm) {

        // middle animation complete
        // initiate fade in animation
        this._startTransFadeOut = null;
        this._startTransMid = null;
        this._startTransFadeIn = FadeIn.random();
        this.screen.stateManager.startTransitionFadeInStarted(); // game_state_manager.js

      }
      else {

        // fade in animation complete
        // finish transition
        this._startTransFadeOut = null;
        this._startTransMid = null;
        this._startTransFadeIn = null;

        this.screen.stateManager.startTransitionFinished(); // game_state_manager.js
      }
    }

  }
}
