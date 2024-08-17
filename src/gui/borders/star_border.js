/**
 * @file StarBorder cached star animation
 */
class StarBorder extends Border {

  /**
   * Trace shadow/ribbon decoration along shape.
   * @param {number[]} rect The rectangle to align in.
   * @param {Vector[]} verts The computed border shape.
   * @returns {Vector[][]} The vertices to loop over.
   */
  _decorations(rect, verts) {
    const shape = verts.slice(0);
    const d = v(0.01, 0.01);
    return [[...shape, shape[0], ...shape.reverse().map((v) => v.add(d)), shape[0].add(d)]];
  }

  /**
   * get animated star shape
   * @param {number[]} rect the outer bounding
   */
  _verts(rect) {

    // avoid computing shape multiple times
    const titleKey = 'star window border';
    const mgr = BorderManager();
    if (mgr.hasBorder(titleKey)) {
      const cached = mgr.getBorder(titleKey);
      this._offset = v(rect[0] - cached.rect[0], rect[1] - cached.rect[1]);
      return cached.verts;
    }

    // get shape from star edge
    const starEdge = EdgeManager().getEdge('star');
    const pos = v(...rectCenter(...rect));
    const animFrames = [-1, -0.95, -0.8, -0.5, 0, 0.5, 0.8, 0.95, 1];
    const result = animFrames.map((anim) => [...starEdge.vTrace(pos, 0 + 0.05 * anim)]);

    // make animation loop cleanly
    const loopedResult = [...result, ...result.reverse()];

    //
    mgr.submitNewBorder(titleKey, rect, loopedResult);
    return loopedResult;
  }
}
