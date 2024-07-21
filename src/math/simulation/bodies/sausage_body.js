/**
 * @file SsausageBody thick line segment with round ends.
 */
class SausageBody extends Body {
  _edgeKey = 'sausage';

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} a
   * @param {Vector} b
   */
  constructor(sim, a, b) {
    super(sim, va(a, b));

    this.a = a;
    this.b = b;

    const d = b.sub(a);
    this.pos = va(a, b);
    this.angle = d.getAngle();

    //
    this.title = 'line';
    this.icon = lineIcon;
  }

  /**
   *
   */
  buildEdge() {
    return new SausageEdge();
  }

  /**
   * Override generic pizza grabber with sausage grabber.
   */
  buildGrabber() {
    const grabber = new SausageGrabber(
      this.a, this.b, SausageEdge.rad(),
      (...p) => this.grabbed(...p));
    return grabber;
  }

  /**
   *
   * @param {number} dt The time elapsed in milliseconds.
   * @param {...any} args
   */
  update(dt, ...args) {
    super.update(dt, ...args);

    const p = this.pos;
    const a = this.angle;
    const r = SausageEdge.length() / 2;

    this.a = p.sub(vp(a, r));
    this.b = p.add(vp(a, r));

    // update LineGrabber instance
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

    // draw straight segment
    g.strokeStyle = global.colorScheme.fg;
    g.lineCap = 'round';
    g.lineWidth = 2 * SausageEdge.rad();
    g.beginPath();
    g.moveTo(...a);
    g.lineTo(...b);
    g.stroke();
    g.lineWidth = global.lineWidth;
  }
}
