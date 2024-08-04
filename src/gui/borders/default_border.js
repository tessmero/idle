/**
 * @file DefultBorder plain rectangle border
 */
class DefaultBorder extends Border {

  /**
   * trace the outline of this border starting near top-left corner.
   * @param {number[]} rect The rectangle to align in.
   * @returns {Vector[]} The vertices to loop over.
   */
  _verts(rect) {
    return rectCorners(...rect);
  }

  /**
   * Override Border.
   * @param {object} _g The graphics context.
   * @param {number[]} _rect The rectangle.
   */
  cleanup(_g, _rect) {
    // do nothing
  }
}
