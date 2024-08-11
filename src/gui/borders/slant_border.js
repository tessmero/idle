/**
 * @file SlantBorder parallelogram shaped border
 */
class SlantBorder extends Border {
  #dx;

  /**
   *
   * @param {object} params
   * @param {number} params.slant Distance along width to cut off
   */
  constructor(params = {}) {
    super(params);
    const { slant = 0.02 } = params;
    this.#dx = v(slant, 0);
  }

  /**
   * trace parallelogram shape by cutting off two corners of the rectangle.
   * @param {number[]} rect The rectangle to align with.
   * @returns {Vector[]} The vertices to loop over.
   */
  _verts(rect) {
    const [a, b, c, d] = rectCorners(...rect);
    const ab = a.add(this.#dx);
    const cd = c.sub(this.#dx);
    return [d, ab, b, cd];
  }
}
