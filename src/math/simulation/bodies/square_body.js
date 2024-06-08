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
    this.verts = verts;

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

  /**
   * Override standard body draw routine.
   * @param g
   */
  draw(g) {
    const c = this.pos;
    const a = this.angle;
    const r = this.rad;
    SquareBody.drawSquare(g, c, a, r);
  }

  /**
   *
   * @param g
   * @param center
   * @param angle
   * @param rad
   */
  static drawSquare(g, center, angle, rad) {
    g.fillStyle = global.colorScheme.fg;
    g.beginPath();
    for (let i = 0; i < 4; i++) {
      const p = center.add(vp(angle + pio2 * (i + 0.5), rad * sqrt2));
      g.lineTo(...p.xy());
    }
    g.closePath();
    g.fill();
  }

}
