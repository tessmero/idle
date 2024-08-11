/**
 * @file StoryBorder animated border used in StoryGui
 */
class StoryBorder extends Border {

  /**
   * Compute or load cached border shape.
   * @param {number[]} rect The rectangle to align with.
   * @returns {Vector[]} The vertices to loop over.
   */
  _verts(rect) {

    // avoid computing shape multiple times
    const titleKey = 'story border';
    const mgr = BorderManager();
    if (mgr.hasBorder(titleKey)) {
      const cached = mgr.getBorder(titleKey);
      this._offset = v(rect[0] - cached.rect[0], rect[1] - cached.rect[1]);
      return cached.verts;
    }

    // generate random circles
    const circs = [];
    const rads = [0.03, 0.05];
    const [x, y, w, h] = padRect(...rect, -rads[1]);
    for (let i = 0; i < 300; i++) {
      const pos = v(randRange(x, x + w), randRange(y, y + h));
      const rad = randRange(...rads);
      circs.push([pos, rad]);
    }

    // add insurance circles
    const ir = 0.25;
    const id = v(0.28, 0);
    const center = v(...rectCenter(...rect));
    circs.push([center, ir]);
    circs.push([center.add(id), ir]);
    circs.push([center.sub(id), ir]);

    // add random animation for each circle
    circs.forEach((c) => c.push(
      vp(randRange(0, twopi), randRange(0.001, 0.02))
    ));

    // iterate over animation frames
    const result = [];
    const frames = [-1, -0.95, -0.8, -0.5, 0, 0.5, 0.8, 0.95, 1];
    frames.forEach((fr) => {

      // iterate over angles
      const verts = [];
      const n = 1000;
      for (let i = 0; i < n; i++) {
        const angle = i * twopi / n + 5 * pio4;

        // find outermost intersection
        const outside = center.add(vp(angle, 1));
        const intersections = circs.flatMap(([pos, rad, wiggle]) =>
          this._findLineCircleIntersections(
            center, outside, pos.add(wiggle.mul(fr)), rad)
        );
        let outermost = center;
        let maxD2 = 0;
        intersections.forEach((p) => {
          const d2 = center.sub(p).getD2();
          if (d2 > maxD2) {
            maxD2 = d2;
            outermost = p;
          }
        });

        // add computed point
        verts.push(outermost);
      }
      result.push(verts);
    });

    // make animation loop cleanly
    const loopedResult = [...result, ...result.reverse()];

    //
    mgr.submitNewBorder(titleKey, rect, loopedResult);
    return loopedResult;
  }

  /**
   *
   * @param {number} startValue
   * @param {number} stopValue
   * @param {number} cardinality
   */
  _linspace(startValue, stopValue, cardinality) {
    const arr = [];
    const step = (stopValue - startValue) / (cardinality - 1);
    for (let i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }

  /**
   *
   * @param {Vector} p0
   * @param {Vector} p1
   * @param {Vector} center
   * @param {number} rad
   */
  _findLineCircleIntersections(p0, p1, center, rad) {
    // Calculate the coefficients of the quadratic equation
    const d = p1.sub(p0);
    const dc = p0.sub(center);
    const a = d.getD2();
    const b = 2 * (d.x * dc.x + d.y * dc.y);
    const c = dc.x * dc.x + dc.y * dc.y - rad * rad;

    // Calculate the discriminant
    const discriminant = b * b - 4 * a * c;

    // If discriminant is negative, no intersection
    if (discriminant < 0) {
      return [];
    }

    // Find the two points of intersection
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b + sqrtDiscriminant) / (2 * a);
    const t2 = (-b - sqrtDiscriminant) / (2 * a);

    const intersections = [];

    if (t1 >= 0 && t1 <= 1) {
      intersections.push(p0.add(d.mul(t1)));
    }

    if (t2 >= 0 && t2 <= 1) {
      intersections.push(p0.add(d.mul(t2)));
    }

    return intersections;
  }
}
