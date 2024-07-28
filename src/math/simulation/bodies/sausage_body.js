/**
 * @file SsausageBody thick line segment with round ends.
 */
class SausageBody extends Body {
  _edgeKey = 'sausage';

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   */
  constructor(sim, pos) {
    super(sim, pos);

    this.angle = pio4;

    //
    this.title = 'line';
    this.icon = lineIcon;
  }

  /**
   *
   */
  buildEdge() {
    return new SausageEdge(this.isMiniature);
  }

  /**
   * Override generic pizza grabber with sausage grabber.
   */
  buildGrabber() {
    const grabber = new SausageGrabber(
      ...this.getEpr(),
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

    // update LineGrabber instance
    this.grabber.updateEpr(...this.getEpr());

    return true;
  }

  /**
   * get endpoints and radius parameters for drawing or to pass to grabber
   */
  getEpr() {
    const p = this.pos;
    const a = this.angle;
    const m = this.edge.length / 2;

    return [p.sub(vp(a, m)), p.add(vp(a, m)), this.edge.rad];
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    const [a, b, r] = this.getEpr();

    // draw straight segment
    g.strokeStyle = global.colorScheme.fg;
    g.lineCap = 'round';
    g.lineWidth = 2 * r;
    g.beginPath();
    g.moveTo(...a.xy());
    g.lineTo(...b.xy());
    g.stroke();
    g.lineWidth = global.lineWidth;
  }
}
