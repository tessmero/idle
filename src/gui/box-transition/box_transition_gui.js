/**
 * @file Box Transition GUI
 * Top-level gui container/placeholder that is active
 * as player enters or exits a box.
 */
class BoxTransitionGui extends Gui {

  #t = 0;
  #closeDur = 0;
  #glideDur = 1000;
  #openDur = 0;
  #totalDur;

  /**
   *
   * @param {number[]} rect The rectangle to cover.
   */
  constructor(rect) {
    super('Box Transition Gui', rect);

    this.#totalDur = this.#closeDur + this.#glideDur + this.#openDur;
  }

  /**
   * Implement Gui, but contain no children gui elements.
   * Instead we extend the Gui draw method in this file.
   * @param {GameScreen} _screen The screen that will display this transition.
   * @returns {GuiElement[]} An empty array indicating no gui elements.
   */
  buildElements(_screen) {
    return [];
  }

  /**
   * Show the the hud behind this transition effect.
   * @returns {Gui} The gui to display in the background.
   */
  getBackgroundGui() {
    return this.screen.stateManager.getGuiForState(GameStates.playing);
  }

  /**
   * Extend Gui draw method by adding an animated box.
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    // skip anim if gui was rebuilt (screen resized partway through)
    if (!this.setStateParams) {
      this.#t = this.#totalDur;
      return;
    }

    let t = this.#t;

    t = t - this.#openDur;
    if (t < 0) {
      this.drawLid(g, 1 - (-t / this.#openDur));
      return;
    }

    t = t - this.#glideDur;
    if (t < 0) {
      this.drawGliding(g, 1 - (-t / this.#glideDur));
      return;
    }

    t = t - this.#closeDur;
    if (t < 0) {
      this.drawLid(g, (-t / this.#closeDur));
      return;
    }
  }

  /**
   * Unused lid opening/closing animation segment.
   * @param {object} g The graphics context.
   * @param {number} anim The animation state in range 0-1.
   */
  drawLid(g, anim) {

    const [x, y, w, h] = this.screen.rect;

    g.fillStyle = global.colorScheme.fg;

    const thick = h * anim / 2;
    g.fillRect(x, y, w, thick);
    g.fillRect(x, y + h - thick, w, thick);
  }

  /**
   * Draw a box moving and rotating from the old to the new position.
   * @param {object} g The graphics context.
   * @param {number} anim The animation state in range 0-1.
   */
  drawGliding(g, anim) {
    const params = this.setStateParams;

    // lookup center,angle,radius of the two terminal squares
    const [c0, a0, r0] = params.fromSquare;
    const [c1, a1, r1] = params.toSquare;

    // interpolate current animated square
    const c = va(c0, c1, anim);
    const a = avg(a0, a1, anim);
    const r = avg(r0, r1, anim);

    // draw animated square
    BoxBuddy.drawBoxWithArrow(g, c, a, r);
  }

  /**
   * Get the center, angle, and radius of the given square thing.
   * @param  {number[]|Body} square The on-screen x,y,w,h or SquareBody instance.
   */
  static _car(square) {
    if (square instanceof SquareBody) {
      return [square.pos, cleanAngle(square.angle), square.rad];
    }

    const rc = rectCorners(...square);
    const c = va(rc[0], rc[2]);
    const rad = Math.abs(c.x - rc[0].x);
    return [c, 0, rad];
  }

  /**
   * Extend standard Gui update by advancing the animation.
   * @param {number} dt The time elapsed in millseconds.
   */
  update(dt) {
    super.update(dt);

    // skip anim if gui was rebuilt (screen resized partway through)
    if (!this.setStateParams) {
      this.#t = this.#totalDur;
      return;
    }

    this.#t = this.#t + dt;

    if (this.#t > (this.#totalDur)) {

      // check if screen change is due after animation
      const toScreen = this.setStateParams.toScreen;
      if (toScreen) {
        this.screen.gsp.setInnerScreen(toScreen);
        toScreen.stateManager.setState(GameStates.playing);
        toScreen.macro = this.macro;
      }
      else {
        this.screen.stateManager.setState(GameStates.playing);
      }
    }
  }
}
