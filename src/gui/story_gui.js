/**
 * @file StoryGui
 * Top-level gui container that appears during special story events.
 */
class StoryGui extends Gui {
  title = 'story';
  layoutData = STORY_GUI_LAYOUT;

  #moreClicked = false;

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
   * @param {object} layout The rectangles computed from css layout data.
   * @returns {GuiElement[]} The gui elements for the screen.
   */
  buildElements(screen, layout) {

    // build typical gui elements
    const result = [
      // new IconButton(r, umbrellaIcon, () => this.closeStoryGui()),
      new DynamicTextLabel(layout.messageDiv, () => this.buildDisplayText()).withScale(0.3),
      new TextButton(layout.moreBtn, 'more...', () => { this.#moreClicked = true; }).withScale(0.3),
      new TextButton(layout.okayBtn, 'Okay', () => this.closeStoryGui()).withScale(0.3),
    ];

    // also show tutorial if a tool should be featured
    const hk = this._hook;
    if (hk && hk.tool) {
      const innerScreen = TutorialTooltipPopup.getTutorialScreen(hk.tool);
      result.push(new GuiScreenPanel(r, innerScreen, true));
    }

    return result;
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
