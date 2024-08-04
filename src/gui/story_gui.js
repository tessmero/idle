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
   * Construct story gui elements.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const fontSize = 0.39;

    this._borderElem = new CompositeGuiElement(
      layout.borderDiv, {
        opaque: true,
        border: new StoryBorder(),
      });

    this._okayBtn = new TextButton(layout.moreBtn, {
      label: '...',
      action: () => { this.#moreClicked = !this.#moreClicked; },
      scale: fontSize,
      border: new RoundedBorder(),
    });

    this._extraBtn = new TextButton(layout.okayBtn, {
      label: 'Okay',
      action: () => this.closeStoryGui(),
      scale: fontSize,
      border: new RoundedBorder(),
    });

    // these elements will have flashing border animation
    this._flashElems = [this._borderElem, this._okayBtn, this._extraBtn];

    // build typical gui elements
    return [

      this._borderElem,

      new DynamicTextLabel(layout.messageDiv, {
        labelFunc: () => this.buildDisplayText(),
        scale: fontSize,
      }),

      this._okayBtn,
      this._extraBtn,
    ];
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

        this._flashElems.forEach((c) => {
          c.border.path(g, c.rect);
          g.stroke();
        });
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
