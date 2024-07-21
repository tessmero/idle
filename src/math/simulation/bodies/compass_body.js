/**
 * @file CompassBody compass shaped body.
 */
class CompassBody extends Body {
  _edgeKey = 'compass';

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   */
  constructor(sim, pos) {
    super(sim, pos);

    //
    this.title = 'compass';
    this.icon = increaseIcon;
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   * @param {...any} p
   */
  update(dt, ...p) {
    this.spin(-1e-6 * dt);
    return super.update(dt, ...p);
  }

  /**
   *
   */
  buildEdge() {

    const a = 1;
    const b = 5;
    const scale = 3e-2;

    let verts = [
      [0, b], [a, a],
      [b, 0], [a, -a],
      [0, -b], [-a, -a],
      [-b, 0], [-a, a],
    ];

    verts = verts.map((xy) => v(...xy).mul(scale));

    return new PolygonEdge('compass', verts.reverse());
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
