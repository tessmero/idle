/**
 *
 */
class SausageBody extends Body {

  /**
   *
   * @param sim
   * @param a
   * @param b
   * @param rad
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
   *
   */
  buildGrabber() {
    // let grabber = new EdgeGrabber(
    //    this.pos,this.angle,this.edge,
    const grabber = new SausageGrabber(
      this.a, this.b, this.rad,
      (...p) => this.grabbed(...p));
    grabber.update();
    return grabber;
  }

  /**
   *
   * @param dt
   * @param {...any} args
   */
  update(dt, ...args) {
    super.update(dt, ...args);

    const p = this.pos;
    const a = this.angle;
    const r = this.length / 2;

    this.a = p.sub(vp(a, r));
    this.b = p.add(vp(a, r));

    // update EdgeGrabber instance
    // this.grabber.pos = p
    // this.grabber.angle = a

    // update LineGrabber isntance
    this.grabber.a = this.a;
    this.grabber.b = this.b;
    this.grabber.update();

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
