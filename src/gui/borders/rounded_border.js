/**
 * @file RoundedBorder with round corners.
 */
class RoundedBorder extends Border {

  #radius;

  /**
   *
   * @param  {number} radius Circle radius for corners.
   */
  constructor(radius = 0.01) {
    super();
    this.#radius = radius;
  }

  /**
   * trace rounded rectangle.
   * @param {number[]} rect The rectangle to align with.
   * @returns {Vector[]} The vertices to loop over.
   */
  _verts(rect) {
    const rad = this.#radius;

    // number of segments per corner
    const n = Math.floor(rad / 0.001);

    // centers of circular corners
    const centers = rectCorners(...padRect(...rect, -rad));

    //
    const result = [];
    centers.forEach((c, i) => {
      const a0 = (i + 2) * pio2;
      const a1 = a0 + pio2;
      for (let si = 0; si < n; si++) {
        const a = avg(a0, a1, si / n);
        const p = c.add(vp(a, rad));
        result.push(p);
      }
    });
    return result;
  }
}
