
/**
 * @file ProgressIndicator gui element.
 *
 * Displays progress bar overlay with color-inversion effect.
 */
class ProgressIndicator extends GuiElement {

  /**
   * valueFunc returns a number
   * will be truncated to range [0,1]
   * @param {number[]} rect The rectangle that will be fully covered at value=1
   * @param {Function} valueFunc The function who's return value will be used.
   */
  constructor(rect, valueFunc) {
    super(rect);
    this.valueFunc = valueFunc;
    this.outline = true;
  }

  /**
   * Chainable helper to set outline.
   * @param {boolean} o True if an outline should be drawn.
   */
  withOutline(o) {
    this.outline = o;
    return this;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    ProgressIndicator._draw(
      g, this.rect, this.valueFunc(), this.outline);
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
   * @param {boolean} outline True if the outline should also be drawn.
   */
  static _draw(g, rect, progress, outline = false) {

    let prg = progress;

    // force progress into range [0,1]
    if ((!prg) || (prg < 0)) { prg = 0; }
    if (prg > 1) { prg = 1; }

    // draw outline
    const r = rect;
    if (outline) {
      g.lineWidth = global.lineWidth;
      g.fillStyle = global.colorScheme.fg;
      g.strokeRect(...r);
    }

    // draw progress bar
    g.globalCompositeOperation = 'xor';
    g.fillStyle = global.colorScheme.fg;
    g.fillRect(r[0], r[1], r[2] * prg, r[3]);
    g.globalCompositeOperation = 'source-over';
  }
}
