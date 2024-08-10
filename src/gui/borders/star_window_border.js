/**
 * @file StarWindowBorder window with cached star animation
 */
class StarWindowBorder extends WindowBorder {

  /**
   * Trace thick border shape.
   * @param {number[]} rect The rectangle to align in.
   * @param {Vector[]} verts The computed border shape.
   * @returns {Vector[][]} The vertices to loop over.
   */
  _decorations(rect, verts) {
    const shape = verts.slice(5);
    const d = v(0.01, 0.01);
    return [[...shape, ...shape.reverse().map((v) => v.add(d))]];
  }

  /**
   * Override WindowBorder
   * @param {number[]} rect the outer bounding
   */
  _verts(rect) {

    // avoid computing shape multiple times
    const titleKey = 'star window border';
    const mgr = BorderManager();
    if (mgr.hasBorder(titleKey)) {
      const cached = mgr.getBorder(titleKey);
      this.offsetX = rect[0] - cached.rect[0];
      this.offsetY = rect[1] - cached.rect[1];
      return cached.verts;
    }

    const outerCorners = rectCorners(...rect);

    // use star edge for inner shape
    const starEdge = EdgeManager().getEdge('star');
    const pos = v(...rectCenter(...rect));

    const animFrames = [-1, -0.95, -0.8, -0.5, 0, 0.5, 0.8, 0.95, 1];
    const dv = v(0, 0);
    const result = animFrames.map((anim) => {
      const innerShape = [...starEdge.vTrace(pos, 0 + 0.05 * anim)];
      return [

        // trace outer rectangle clockwise
        ...outerCorners, outerCorners[0],

        // trace animated inner shape counter-clockwise
        innerShape[0].add(dv.mul(anim)), ...innerShape.reverse().map((v) => v.add(dv.mul(anim))),

      ];
    });

    // make animation loop cleanly
    const loopedResult = [...result, ...result.reverse()];

    //
    mgr.submitNewBorder(titleKey, rect, loopedResult);
    return loopedResult;
  }
}
