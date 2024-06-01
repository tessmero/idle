/**
 * @file TextButton gui element.
 * a button with some text.
 */
class TextButton extends Button {

  /**
   *
   * @param rect
   * @param label
   * @param action
   */
  constructor(rect, label, action) {
    super(rect, action);
    this.label = label;
    this.center = true;
  }

  /**
   *
   * @param g
   */
  draw(g) {
    super.draw(g);
    drawText(g, ...rectCenter(...this.rect),
      this.label, this.center,
      new FontSpec(0, this.scale, false));
  }

}
