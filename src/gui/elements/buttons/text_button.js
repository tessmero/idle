/**
 * @file TextButton gui element.
 * a button with some text.
 */
class TextButton extends Button {

  /**
   *
   * @param {number[]} rect The x,y,w,h of this button.
   * @param {string} label The text to display.
   * @param {Function} action The function to call when clicked.
   */
  constructor(rect, label, action) {
    super(rect, action);
    this.label = label;
    this.center = true;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);
    drawText(g, ...rectCenter(...this.rect),
      this.label, this.center,
      new FontSpec(0, this.scale, false));
  }

}
