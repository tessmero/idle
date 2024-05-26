/**
 * base square body
 */
class SquareBody extends Body {

  /**
   *
   * @param sim
   * @param pos
   * @param rad
   */
  constructor(sim, pos, rad) {
    super(sim, pos);

    this.rad = rad;

    //
    this.title = 'square';
    this.icon = uncheckedIcon;
  }

  /**
   *
   */
  buildEdge() {

    const r = this.rad;

    let verts = [
      [r, r], [-r, r], [-r, -r], [r, -r],
    ];

    verts = verts.map((xy) => v(...xy));

    return new PolygonEdge(verts);
  }

  /**
   *
   */
  buildGrabber() {
    return new EdgeGrabber(
      this.pos, this.angle, this.edge,
      (...p) => this.grabbed(...p), 0);
  }

}
