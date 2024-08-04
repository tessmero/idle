/**
 * @file SnowglobeBorder used in skills tab in sandbox mode
 */
class SnowglobeBorder extends Border {

  /**
   * trace snowglobe shape.
   * @param  {number[]} rect The rectangle to align with,
   *                         which should be square.
   * @returns {Vector[]} The vertices to loop over.
   */
  _verts(rect) {
    const center = v(...rectCenter(...rect));
    const rad = rect[2] / 2;

    // number of segments in round part
    const n = Math.floor(rad / 0.001);

    // const corners = rectCorners(...rect);

    //
    const result = [];
    const a0 = 5 * pio4;
    const a1 = a0 + twopi;
    for (let si = 0; si < n; si++) {
      const a = avg(a0, a1, si / n);
      const p = center.add(vp(a, rad));
      result.push(p);
    }
    return result;
  }
}
