/**
 * @file SsausageBody thick line segment with round ends.
 */
class SausageBody extends Body {

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} a
   * @param {Vector} b
   * @param {number} rad
   */
  constructor(sim, a, b, rad = 2e-2) {
    super(sim, va(a, b));

    this.a = a;
    this.b = b;
    this.rad = rad;

    const d = b.sub(a);
    this.length = d.getMagnitude();
    this.angle = d.getAngle();

    //
    this.title = 'line';
    this.icon = lineIcon;
  }

  /**
   *
   */
  buildEdge() {
    const len = this.a.sub(this.b).getMagnitude();
    const edge = new SausageEdge(len, this.rad);
    return edge;
  }

  /**
   * Override generic pizza grabber with sausage grabber.
   */
  buildGrabber() {
    const grabber = new SausageGrabber(
      this.a, this.b, this.rad,
      (...p) => this.grabbed(...p));
    return grabber;
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   * @param {...any} args
   */
  update(dt, ...args) {
    super.update(dt, ...args);

    const p = this.pos;
    const a = this.angle;
    const r = this.length / 2;

    this.a = p.sub(vp(a, r));
    this.b = p.add(vp(a, r));

    // update LineGrabber isntance
    this.grabber.updateEndpoints(this.a, this.b);

    return true;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    const a = this.a.xy();
    const b = this.b.xy();

    // draw sraight segmetn
    g.strokeStyle = global.colorScheme.fg;
    g.lineCap = 'round';
    g.lineWidth = 2 * this.rad;
    g.beginPath();
    g.moveTo(...a);
    g.lineTo(...b);
    g.stroke();
    g.lineWidth = global.lineWidth;
  }
}
