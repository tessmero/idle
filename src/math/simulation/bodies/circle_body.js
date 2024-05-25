// physics-enabled circle
/**
 *
 */
class CircleBody extends Body {
  /**
   *
   * @param sim
   * @param pos
   * @param rad
   */
  constructor(sim, pos, rad) {
    super(sim, pos);

    this.rad = rad;
    this.md2 = rad * rad;

    this.dripChance = global.poiDripChance;

    //
    this.title = 'circle';
    this.icon = circleIcon;
  }

  /**
   *
   */
  buildEdge() {
    return new CircleEdge(this.rad);
  }

  /**
   *
   */
  buildGrabber() {
    return new CircleGrabber(
      this.pos, this.rad,
      (...p) => this.grabbed(...p), 0);
  }

  /**
   *
   * @param g
   */
  draw(g) {
    const p = this.pos;

    // draw circle
    const r = this.rad;
    const c = p.xy();
    g.fillStyle = global.colorScheme.fg;
    g.beginPath();
    g.moveTo(...c);
    g.arc(...c, r, 0, twopi);
    g.fill();

  }

}
