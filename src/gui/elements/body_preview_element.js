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
    const { body } = params;
    this.#body = body;
  }

  /**
   * @param {object} g The graphics context.
   */
  draw(g) {
    const bod = this.#body;
    if (!bod.edge) { return; }

    const pos = v(...rectCenter(...this.rect));
    bod.edge.trace(g, pos, bod.angle, 0.5);
    g.fillStyle = global.colorScheme.fg;
    g.fill();
    super.draw(g);
  }
}
