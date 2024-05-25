// limited wrapping jscanvas 2d graphics context
//  - clearRect
//  - fillRect with foreground color
/**
 *
 */
class GraphicsWrapper {

  /**
   *
   */
  constructor() {
    this.tOffset = v(0, 0);
  }

  /**
   *
   * @param g
   */
  wrap(g) {
    g.fillStyle = global.colorScheme.fg;
    this.g = g;
    return this;
  }

  /**
   *
   * @param x
   * @param y
   */
  translate(x, y) {
    this.g.translate(x, y);
    this.tOffset = this.tOffset.add(v(x, y));
  }

  //
  /**
   *
   */
  rectFilled() {}

  /**
   *
   */
  rectCleared() {}

  /**
   *
   */
  drawDebug() {}

  // mock unsupported js canvas funcs
  /**
   *
   */
  arc() {
    // console.log('arc() ignored');
  }

  /**
   *
   */
  beginPath() {
    // console.log('moveTo() ignored');
  }

  /**
   *
   */
  moveTo() {
    // console.log('moveTo() ignored');
  }

  /**
   *
   */
  lineTo() {
    // console.log('lineTo() ignored');
  }

  /**
   *
   */
  fill() {
    // console.log('fill() ignored');
  }

  /**
   *
   */
  stroke() {
    // console.log('stroke() ignored');
  }

  /**
   *
   */
  strokeRect() {
    // console.log('stroke() ignored');
  }

  /**
   *
   */
  set fillStyle(fs) {
    // if (fs !== global.colorScheme.fg) {
    //  throw new Error('fillStyle must be foreground color');
    // }
    this.g.fillStyle = fs;
  }

  /**
   *
   */
  get fillStyle() {
    return this._fillStyle;
  }

  /**
   *
   */
  set globalCompositeOperation(gco) {
    if (gco !== 'source-over') {
      throw new Error('xor operation not supported');
    }
    this.g.globalCompositeOperation = gco;
  }

  /**
   *
   */
  get globalCompositeOperation() {
    return this.g.globalCompositeOperation;
  }

  // get translated rect position
  /**
   *
   * @param r
   */
  _tr(r) {
    const t = this.tOffset;
    return [r[0] - t.x, r[1] - t.y, r[2], r[3]];
  }

  /**
   *
   * @param {...any} r
   */
  fillRect(...r) {
    this.g.fillRect(...r);
    this.rectFilled(...r);// this._tr(r));
  }

  /**
   *
   * @param {...any} r
   */
  clearRect(...r) {
    this.g.clearRect(...r);
    this.rectCleared(...r);// this._tr(r));
  }
}
