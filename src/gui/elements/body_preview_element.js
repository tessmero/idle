/**
 * @file BodyPreviewElement Gui element that draws one body.
 */
class BodyPreviewElement extends GuiElement {
  #body;

  /**
   *
   * @param {number[]} rect
   * @param {object} params The parameters.
   * @param {Body} params.body
   */
  constructor(rect, params = {}) {
    super(rect, params);
    this.#body = params.body;
  }

  /**
   * @param {object} g The graphics context.
   */
  draw(g) {
    const bod = this.#body;
    const pos = v(...rectCenter(...this.rect));
    bod.edge.trace(g, pos, bod.angle, 0.5);
    g.fillStyle = global.colorScheme.fg;
    g.fill();
    super.draw(g);
  }
}
