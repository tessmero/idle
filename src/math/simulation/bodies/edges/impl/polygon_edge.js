// edge defined by polygon vertices
class PolygonEdge extends PathspecEdge {

  constructor(verts) {
    super();

    verts.push(verts[0]);
    this.verts = verts;

    // comput total circumference
    // and cumulative side lengths
    const csl = [0];
    const n = verts.length;
    let dist = 0;
    for (let i = 0; i < n; i++) {
      dist = dist + verts[(i + 1) % n]
        .sub(verts[i])
        .getMagnitude();
      csl.push(dist);
    }
    this.csl = csl;
  }

  getCircumference() {
    return this.csl[this.csl.length - 1];
  }

  // compute position+normal [angle,radius,normal angle]
  // at given distance along circumerence
  computePoint(d) {

    // list of cumulative side lengths
    const csl = this.csl;

    // which side of polygon are we on
    // Side Index
    const si = -1 + csl.findIndex((td) => d < td);

    // where along that side
    // Side Ratio 0-1
    const sr = (d - csl[si]) / (csl[si + 1] - csl[si]);

    // xy of two relevant polygon verts
    const v = this.verts;
    const v0 = v[si];
    const v1 = v[si + 1];

    // normal angle of polygon side
    const norm = cleanAngle(v1.sub(v0).getAngle() - pio2);

    // xy of point in question
    const p = va(v0, v1, sr);

    return [p.getAngle(), p.getMagnitude(), norm];
  }
}
