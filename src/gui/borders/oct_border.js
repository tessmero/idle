/**
 * @file OctBorder where all four corners are cut off
 * leaving 8-sided shape with 45 degree angles
 */
class OctBorder extends Border {
  #dx;
  #dy;

  /**
   *
   * @param {object} params
   * @param  {number} params.cut Length along edge to cut off
   */
  constructor(params = {}) {
    super(params);
    const { cut = 0.02 } = params;
    this.#dx = v(cut, 0);
    this.#dy = v(0, cut);
  }

  /**
   * trace 8-sided shape by cutting off corners.
   * @param {number[]} rect The rectangle to align with.
   * @returns {Vector[]} The vertices to loop over.
   */
  _verts(rect) {
    const [a, b, c, d] = rectCorners(...rect);
    const dx = this.#dx;
    const dy = this.#dy;
    return [
      a.add(dy), a.add(dx),
      b.sub(dx), b.add(dy),
      c.sub(dy), c.sub(dx),
      d.add(dx), d.sub(dy),
    ];
  }

}
