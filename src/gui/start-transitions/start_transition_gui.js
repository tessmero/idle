/**
 * @file Start Transition GUI
 * Top-level gui container/placeholder that is active
 * during transition from start menu to game
 */
class StartTransitionGui extends Gui {

  /**
   *
   * @param rect
   * @param isMain
   */
  constructor(rect, isMain) {
    super('Start Transition Gui', rect);

    this.isMain = isMain;

    // initiate fade out animation if necessary
    if (!(this._startTransFadeOut || this._startTransMid || this._startTransFadeIn)) {
      this._startTransFadeOut = FadeOut.random();
    }
  }

  /**
   * implement Gui
   * @param _screen
   */
  buildElements(_screen) {
    return []; // no gui elements
  }

  /**
   * show the old screen
   * behind the transition effect
   */
  getBackgroundGui() {
    const bgState = this._startTransFadeOut ?
      GameStates.startMenu : GameStates.playing;
    return this.screen.stateManager.getGuiForState(bgState);
  }

  /**
   *
   * @param g
   */
  draw(g) {
    super.draw(g);
    const fs = [this._startTransFadeOut, this._startTransMid, this._startTransFadeIn];
    fs.forEach((f) => { if (f) { f.draw(g, this.rect); } });
  }

  /**
   *
   * @param dt
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
        if (this.isMain) { resetProgression(); } // global.js

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
