
/**
 * @file CrossBody cross shaped body.
 */
class CrossBody extends Body {
  _edgeKey = 'cross';

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   */
  constructor(sim, pos) {
    super(sim, pos);

    //
    this.title = 'cross';
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
    const mini = this.isMiniature;

    const a = 1;
    const b = 5;

    const aa = 1 / 2;
    const c = 6;
    const scale = 2e-2 * (mini ? global.tutorialScaleFactor : 1);

    let verts = [
      [-a, b], [-aa, c], [aa, c], [a, b], [a, a],
      [b, a], [c, aa], [c, -aa], [b, -a], [a, -a],
      [a, -b], [aa, -c], [-aa, -c], [-a, -b], [-a, -a],
      [-b, -a], [-c, -aa], [-c, aa], [-b, a], [-a, a],
    ];

    verts = verts.map((xy) => v(...xy).mul(scale));

    let key = 'cross';
    if (mini) {
      key = `mini ${key}`;
    }
    return new PolygonEdge(key, verts.reverse());
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
