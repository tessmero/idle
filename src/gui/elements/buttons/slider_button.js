/**
 * @file SliderButton
 */
class SliderButton extends Button {

  #sliderVal = 0; // state

  // drawing settings
  #rad = 0.01; // radius of circle
  #thick = 0.005; // thickness of line
  #line; // terminals of line

  /**
   *
   * @param {number[]} rect
   * @param {object} params The parameters.
   * @param {number} params.sliderVal The initial value for the slider button
   */
  constructor(rect, params = {}) {
    super(rect, params);
    const {
      sliderVal = 1,
    } = params;

    this.#sliderVal = sliderVal;

    // compute terminals, leaving space for circle to hang off
    const [x, y, w, h] = padRect(...rect, -this.#rad);
    this.#line = [v(x, y + h / 2), v(x + w, y + h / 2)];
  }

  /**
   *
   */
  get sliderVal() { return this.#sliderVal; }

  /**
   *
   */
  set sliderVal(_s) { throw new Error('should use setSliderVal()'); }

  /**
   *
   * @param {number} sv The new slider value
   */
  setSliderVal(sv) {
    let s = sv;
    if (s < 0) { s = 0; }
    if (s > 1) { s = 1; }
    this.#sliderVal = s;
  }

  /**
   * Extend button click by setting slider position and initiating drag.
   */
  click() {
    this._slideToMouse();

    // start dragging
    this.screen.draggingElem = this.titleKey;

    // execute action like regular button
    return super.click();
  }

  /**
   *
   */
  drag() {
    this._slideToMouse();

    // execute action like regular button
    return super.click({ mute: true });
  }

  /**
   * set slider pos to match mouse pos
   */
  _slideToMouse() {
    const p = this.screen.mousePos;
    const [a, b] = this.#line;
    this.setSliderVal((p.x - a.x) / (b.x - a.x));
  }

  /**
   * @param  {object} g The graphics context.
   */
  draw(g) {

    // draw text label
    if (this.label) {
      const [x, y] = rectCenter(...this.rect);
      drawText(g, x, y - 0.02, this.label, true, new FontSpec(0, this.scale, false));
    }

    // draw horizontal line
    const [a, b] = this.#line;
    g.lineWidth = this.#thick;
    g.strokeStyle = global.colorScheme.fg;
    g.beginPath();
    g.moveTo(...a.xy());
    g.lineTo(...b.xy());
    g.stroke();

    // draw circle on line
    const [x, y] = va(a, b, this.#sliderVal).xy();
    const rad = this.#rad;
    g.beginPath();
    g.moveTo(x + rad, y);
    g.arc(x, y, rad, 0, twopi);
    g.fill();

    if (this.hovered || this._isBeingDragged()) {

      // highlight circle
      g.strokeStyle = global.colorScheme.hl;
      g.beginPath();
      g.moveTo(x + rad, y);
      g.arc(x, y, rad, 0, twopi);
      g.stroke();
    }
  }

  /**
   *
   */
  _isBeingDragged() {
    return this.screen.draggingElem === this.titleKey;
  }
}
