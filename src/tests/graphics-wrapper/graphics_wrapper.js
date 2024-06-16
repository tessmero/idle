/**
 * @file limited jscanvas wrapper for tests.
 *
 * Only supports
 *  - clearRect
 *  - fillRect with foreground color
 */
class GraphicsWrapper {

  #tOffset = v(0, 0);
  #g;

  /**
   * Wrap the given canvas graphics context.
   * @param {object} g The CanvasRenderingContext2D instance.
   */
  wrap(g) {
    this._g = g;
    return this;
  }

  /**
   *
   */
  get g() { throw new Error('not allowed'); }

  /**
   *
   */
  set g(_g) { throw new Error('should use wrap()'); }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  translate(x, y) {
    this._g.translate(x, y);
    this.#tOffset = this.#tOffset.add(v(x, y));
  }

  /**
   * Called after a rect is filled
   */
  rectFilled() {}

  /**
   * Called after a rect is cleared
   */
  rectCleared() {}

  /**
   *
   */
  drawDebug() {

    // recurse if this is wrapping another wrapper
    if (this._g.drawDebug) { this._g.drawDebug(); }
  }

  /**
   * mock unsupported js canvas funcs
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
    this._g.fillStyle = fs;
  }

  /**
   *
   */
  get fillStyle() {
    return this._fillStyle;
  }

  /**
   * Superficially allow setting operation with equals sign,
   * but only support normal op (color inversion not supported).
   */
  set globalCompositeOperation(gco) {
    if (gco !== 'source-over') {
      throw new Error('xor operation not supported');
    }
    this._g.globalCompositeOperation = gco;
  }

  /**
   *
   */
  get globalCompositeOperation() {
    return this._g.globalCompositeOperation;
  }

  /**
   *
   * @param {...any} r
   */
  fillRect(...r) {
    this._g.fillRect(...r);
    this.rectFilled(r);
  }

  /**
   *
   * @param {...any} r
   */
  clearRect(...r) {
    this._g.clearRect(...r);
    this.rectCleared(r);
  }
}
