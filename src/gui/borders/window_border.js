/**
 * @file WindowBorder used to fill around given inner region
 */
class WindowBorder extends Border {
  #hole;

  /**
   *
   * @param {object} params
   * @param {number[]} params.hole The inner rectangle to leave unfilled.
   */
  constructor(params = {}) {
    super(params);
    const { hole } = params;
    this.#hole = hole;
  }

  /**
   *
   */
  get hole() { return this.#hole; }

  /**
   *
   * @param {number[]} rect
   */
  _verts(rect) {
    const verts = rectCorners(...rect);
    const innerCorners = rectCorners(...this.#hole);
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
