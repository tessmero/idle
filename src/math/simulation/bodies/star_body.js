/**
 * @file StarBody wavey star/flower shaped body.
 */
class StarBody extends Body {
  _edgeKey = 'star';

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   */
  constructor(sim, pos) {
    super(sim, pos);

    //
    this.title = 'star';
    this.icon = starIcon;
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
    return new StarEdge();
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
