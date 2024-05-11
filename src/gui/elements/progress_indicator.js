// progress bar
class ProgressIndicator extends GuiElement {

  // valueFunc returns a number
  // will be truncated to range [0,1]
  constructor(rect, valueFunc) {
    super(rect);
    this.valueFunc = valueFunc;

    this.scale = ProgressIndicator.scale();
    this.outline = true;
  }

  withOutline(o) {
    this.outline = o;
    return this;
  }

  static scale() { return 0.5; }

  // implement GuiElement
  draw(g) {
    ProgressIndicator._draw(
      g, this.rect, this.valueFunc(), this.outline);
  }

  // draw bar for progress between 0 and 1
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
