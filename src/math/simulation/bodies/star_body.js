/**
 * @file starbody sinusoidal star/flower
 */
class StarBody extends Body {
  /**
   *
   * @param sim
   * @param pos
   * @param n
   * @param minRad
   * @param maxRad
   */
  constructor(sim, pos, n, minRad, maxRad) {
    super(sim, pos);

    this.n = n;
    this.minRad = minRad;
    this.maxRad = maxRad;

    //
    this.title = 'star';
    this.icon = starIcon;
  }

  /**
   *
   * @param dt
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
    return new StarEdge(this.n, this.minRad, this.maxRad);
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
