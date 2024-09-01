/**
 * @file Button gui element.
 * Base class for typical rectangular buttons
 */
class Button extends GuiElement {
  #action;
  #mute;

  /**
   *
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {object} params The parameters.
   * @param {Function} params.action The function to call when clicked.
   * @param {string} params.titleKey Used to maintain hovered state if parent rebuilds
   * @param {boolean} params.mute True to skip default click sound
   */
  constructor(rect, params = {}) {
    super(rect, {
      border: new RoundedBorder(),
      textAlign: 'center',
      ...params,
    });

    const {
      titleKey,
      action = () => {}, // default action is to do nothing
      mute = false,
    } = params;

    if (!titleKey) {
      throw new Error('Button requires param `titleKey`');
    }

    this.#action = action;
    this.#mute = mute;
  }

  /**
   * Extend GuiElement update to play sound when newly hovered.
   * @param {...any} args
   */
  update(...args) {
    const result = super.update(...args);

    // check if newly hovered
    const { wasHovered = false } = this._pState;
    if (!wasHovered && this.hovered) {

      // play sound
      this.screen.sounds.hover.play(rectCenter(...this.bounds));
    }

    // remember for next time
    this._pState.wasHovered = this.hovered;

    return result;
  }

  /**
   * Override GuiElement
   */
  isAnimated() {
    return this.hovered;
  }

  /**
   * execute action and by default consume the click event.
   * If action returns truthy value, return false to indicate
   * that the click was not consumed.
   * @param {object} params
   */
  click(params = {}) {

    // play click sound
    if (!(params.mute || this.#mute)) { this.screen.sounds.click.play(); }

    const result = !this.#action();
    return result;
  }
}
