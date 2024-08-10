/**
 * @file CardBorder thick rounded border with square inner corners.
 */
class CardBorder extends RoundedBorder {
  #thickness;

  /**
   *
   * @param {number} radius
   * @param {number} thickness
   */
  constructor(radius = 0.01, thickness = 0.01) {
    super(radius);
    this.#thickness = thickness;
  }

  /**
   * Trace thick border shape.
   * @param {number[]} rect The rectangle to align in.
   * @param {Vector[]} verts The computed border shape.
   * @returns {Vector[][]} The vertices to loop over.
   */
  _decorations(rect, verts) {
    const innerRect = padRect(...rect, -this.#thickness);
    const innerCorners = rectCorners(...innerRect);

    return [
      [

        // trace outer shape clockwise
        ...verts, verts[0],

        // trace inner rectangle counter-clockwise
        innerCorners[0], ...innerCorners.reverse(),

      ],
    ];
  }
}
