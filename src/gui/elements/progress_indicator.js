
/**
 * @file ProgressIndicator gui element.
 *
 * Displays progress bar overlay with color-inversion effect.
 */
class ProgressIndicator extends GuiElement {

  /**
   * Show progress according to valueFunc.
   * @param {number[]} rect The rectangle that will be fully covered at value=1
   * @param {object} params The parameters.
   * @param {Function} params.valueFunc The function to pick progress, 0 is empty, 1 is full.
   */
  constructor(rect, params) {
    super(rect, { border: new DefaultBorder(), ...params });
    this.valueFunc = params.valueFunc;

    if (params.border && (!(params.border instanceof DefaultBorder))) {
      throw new Error('Styled border not supported. Use ProgressButton instead.');
    }
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    ProgressIndicator.draw(
      g, this.rect, this.valueFunc());
    if (this.border) {
      this.border.path(g, this.border.verts(this.rect));
      g.stroke();
    }
  }

  /**
   *
   */
  click() {
    // do nothing
  }

  /**
   * Draw progress bar displaying given progress value between 0 and 1
   * @param {object} g The graphics context.
   * @param {number[]} rect The rectangle to align elements in.
   * @param {number} progress The value to display, 0 is empty, 1 is full.
   */
  static draw(g, rect, progress) {

    let prg = progress;

    // force progress into range [0,1]
    if ((!prg) || (prg < 0)) { prg = 0; }
    if (prg > 1) { prg = 1; }

    // draw progress bar
    g.globalCompositeOperation = 'xor';
    g.fillStyle = global.colorScheme.fg;
    g.fillRect(rect[0], rect[1], rect[2] * prg, rect[3]);
    g.globalCompositeOperation = 'source-over';
  }
}
