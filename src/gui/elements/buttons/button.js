/**
 * @file Button gui element.
 * Base class for typical rectangular buttons
 */
class Button extends GuiElement {
  #action;

  /**
   *
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {object} params The parameters.
   * @param {Function} params.action The function to call when clicked.
   */
  constructor(rect, params = {}) {
    super(rect, {
      border: new RoundedBorder(),
      textAlign: 'center',
      ...params,
    });

    const {
      action = () => {}, // default action is to do nothing
    } = params;

    this.#action = action;
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
   */
  click() {
    const result = !this.#action();
    return result;
  }
}
