/**
 * @file CircleBody object type, a physics-enabled circle.
 */
class CircleBody extends Body {
  _edgeKey = 'circle';

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   */
  constructor(sim, pos) {
    super(sim, pos);

    //
    this.title = 'circle';
    this.icon = circleIcon;
  }

  /**
   *
   */
  buildEdge() {
    return new CircleEdge();
  }

  /**
   *
   */
  buildGrabber() {
    return new CircleGrabber(
      this.pos, this.edge.rad,
      (...p) => this.grabbed(...p), 0);
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    const p = this.pos;

    // draw circle
    const r = this.edge.rad;
    const c = p.xy();
    g.fillStyle = global.colorScheme.fg;
    g.beginPath();
    g.moveTo(...c);
    g.arc(...c, r, 0, twopi);
    g.fill();

  }

}
