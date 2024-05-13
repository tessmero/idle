// transition from start menu to game

// state for transition on global.mainScreen
let _startTransFadeOut = null;
let _startTransMid = null;
let _startTransFadeIn = null;

class StartTransitionGui extends Gui {

  constructor(rect, isMain) {
    super(rect);

    this.isMain = isMain;

    if (isMain) {
      this._startTransFadeOut = _startTransFadeOut;
      this._startTransMid = _startTransMid;
      this._startTransFadeIn = _startTransFadeIn;
    }

    // initiate fade out animation if necessary
    if (!(this._startTransFadeOut || this._startTransMid || this._startTransFadeIn)) {
      this._startTransFadeOut = FadeOut.random();
    }
  }

  reset() {
    this._startTransFadeOut = FadeOut.random();
    this._startTransMid = null;
    this._startTransFadeIn = null;
  }

  // implement Gui
  buildElements() {
    return []; // no gui elements
  }

  // overide Gui
  stopCanvasClear() {
    const fo = this._startTransFadeOut;
    return fo ? fo.stopCanvasClear() : false;
  }

  // override Gui
  // show start menu then hud
  getBackgroundGui() {

    if (this.isMain) {
      const bgState = this._startTransFadeOut ?
        GameStates.startMenu : GameStates.playing;

      return global.allGuis[bgState];
    }

    return null;
  }

  // override
  draw(g) {
    const fs = [this._startTransFadeOut, this._startTransMid, this._startTransFadeIn];
    fs.forEach((f) => { if (f) { f.draw(g, this.rect); } });
  }

  // override
  update(dt) {

    // identify current animation stage
    const fo = this._startTransFadeOut;
    const fm = this._startTransMid;
    const fi = this._startTransFadeIn;
    const f = fo ? fo : (fm ? fm : fi);

    if (!f) { return; }

    // advance current animation stage
    f.t = f.t + dt;

    // check if current stage ended
    if (f.t > f.duration) {
      if (fo) {

        // fade out complete

        if (this.isMain && global.sandboxMode) {

          // NOTE this entire gui may have been
          // skipped in game_states.js

          // skip middle animation
          // start fast fade in
          setColorScheme(ColorScheme.sandbox);// setup.js
          this._startTransFadeOut = null;
          this._startTransMid = null;
          this._startTransFadeIn = FadeIn.random();
          this._startTransFadeIn.duration = this._startTransFadeIn.duration / 2; // increase speed
          if (this.isMain) { resetProgression(); } // game_states.js

        }
        else {

          // initiate middle animation
          this._startTransFadeOut = null;
          this._startTransMid = new StartMessage();
          this._startTransFadeIn = null;

        }

      }
      else if (fm) {

        // middle animation complete
        // initiate fade in animation
        this._startTransFadeOut = null;
        this._startTransMid = null;
        this._startTransFadeIn = FadeIn.random();
        if (this.isMain) { resetProgression(); } // game_states.js

      }
      else {

        // fade in animation complete
        // finish transition
        this._startTransFadeOut = null;
        this._startTransMid = null;
        this._startTransFadeIn = null;

        if (this.isMain) { startTransitionFinished(); } // game_states.js
      }

      if (this.isMain) {

        // assign members to globals defined at top of this file
        _startTransFadeOut = this._startTransFadeOut;
        _startTransMid = this._startTransMid;
        _startTransFadeIn = this._startTransFadeIn;
      }
    }

  }
}
