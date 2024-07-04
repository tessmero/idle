/**
 * @file StoryGui
 * Top-level gui container that appears during special story events.
 */
class StoryGui extends Gui {
  title = 'story';
  _layoutData = STORY_GUI_LAYOUT;

  // flags checked in game_screen.js
  blocksPopups = true;

  #moreClicked = false;
  #flashCountdown = 0;
  #flashDuration = 1000;
  #flashPeriod = 200;

  /**
   *
   * @param {...any} p
   */
  constructor(...p) {
    super(...p);

    const gusp = global._storyGuiStateParams;
    if (gusp) {
      this.setStateParams(gusp);
    }
  }

  /**
   * Extend standard gui update by advancing flashing animation.
   * @param {number} dt The elapsed time.
   */
  update(dt) {
    super.update(dt);

    const cd = this.#flashCountdown;
    if (cd > 0) {
      this.#flashCountdown = cd - dt;
    }
  }

  /**
   * Extend standard gui draw by drawing flashing animation.
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    const cd = this.#flashCountdown;
    if (cd > 0) {
      const per = this.#flashPeriod;
      const flashOn = (cd % per) / per;
      if (flashOn > 0.5) {
        g.strokeStyle = global.colorScheme.hl;
        this.children.forEach((c) => g.strokeRect(...c.rect));
      }
    }
  }

  /**
   *
   */
  blockClickThrough() {
    this.#flashCountdown = this.#flashDuration;
    return true;
  }

  /**
   *
   * @param {object} params The object with hook and prevState
   */
  setStateParams(params) {
    super.setStateParams(params);
    global._storyGuiStateParams = params;
  }

  /**
   *
   */
  get _hook() {
    const p = this._stateParams;
    return p ? p.hook : null;
  }

  /**
   *
   */
  close() {
    super.close();
    global._storyGuiStateParams = null;
  }

  /**
   * Make the previous GUI appear behind this.
   */
  getBackgroundGui() {
    const p = this._stateParams;
    return this.screen.stateManager.getGuiForState(p.prevState);
  }

  /**
   * Construct story gui elements for the given game screen.
   * @param {GameScreen} screen The screen in need of gui elements.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  buildElements(screen) {
    const layout = this.layoutRects(screen);

    // build typical gui elements
    return [
      // new IconButton(r, umbrellaIcon, () => this.closeStoryGui()),
      new CompositeGuiElement(layout.messageDiv).withOpacity(true),
      new DynamicTextLabel(layout.messageDiv, () => this.buildDisplayText()).withScale(0.3),
      new TextButton(layout.moreBtn, '...', () => { this.#moreClicked = !this.#moreClicked; }).withScale(0.3),
      new TextButton(layout.okayBtn, 'Okay', () => this.closeStoryGui()).withScale(0.3),
    ];
  }

  /**
   *
   */
  buildDisplayText() {
    const hook = this._hook;
    const lines = this.#moreClicked ? hook.extra : hook.message;
    return lines.join('\n');
  }

  /**
   *
   */
  closeStoryGui() {
    const p = this._stateParams;
    this.screen.stateManager.setState(p.prevState);
  }
}
