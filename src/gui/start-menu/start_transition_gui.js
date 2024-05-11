// transition from start menu to game
let _startTransFadeOut = null;
let _startTransMid = null;
let _startTransFadeIn = null;
class StartTransitionGui extends Gui {

  constructor() {
    super();

    // initiate fade out animation if necessary
    if (!(_startTransFadeOut || _startTransMid || _startTransFadeIn)) {
      _startTransFadeOut = FadeOut.random();
    }
  }

  // implement Gui
  buildElements() {
    return []; // no gui elements
  }

  // overide Gui
  stopCanvasClear() {
    const fo = _startTransFadeOut;
    return fo ? fo.stopCanvasClear() : false;
  }

  // override Gui
  // show start menu then hud
  getBackgroundGui() {

    const bgState = _startTransFadeOut ?
      GameStates.startMenu : GameStates.playing;

    return global.allGuis[bgState];
  }

  // override
  draw(g) {
    const fs = [_startTransFadeOut, _startTransMid, _startTransFadeIn];
    fs.forEach((f) => { if (f) { f.draw(g); } });
  }

  // override
  update(dt) {

    // identify current animation stage
    const fo = _startTransFadeOut;
    const fm = _startTransMid;
    const fi = _startTransFadeIn;
    const f = fo ? fo : (fm ? fm : fi);

    // advance current animation stage
    f.t = f.t + dt;

    // check if current stage ended
    if (f.t > f.duration) {
      if (fo) {

        // fade out complete

        if (global.sandboxMode) {

          // NOTE this entire gui may have been
          // skipped in game_states.js

          // skip middle animation
          // start fast fade in
          setColorScheme(ColorScheme.sandbox);// setup.js
          _startTransFadeOut = null;
          _startTransMid = null;
          _startTransFadeIn = FadeIn.random();
          _startTransFadeIn.duration = _startTransFadeIn.duration / 2; // increase speed
          resetProgression(); // game_states.js

        }
        else {

          // initiate middle animation
          _startTransFadeOut = null;
          _startTransMid = new StartMessage();
          _startTransFadeIn = null;

        }

      }
      else if (fm) {

        // middle animation complete
        // initiate fade in animation
        _startTransFadeOut = null;
        _startTransMid = null;
        _startTransFadeIn = FadeIn.random();
        resetProgression(); // game_states.js

      }
      else {

        // fade in animation complete
        // finish transition
        _startTransFadeOut = null;
        _startTransMid = null;
        _startTransFadeIn = null;

        startTransitionFinished(); // game_states.js
      }
    }

  }
}
