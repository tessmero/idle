/**
 * @file BodyContextMenu gui element
 * context menu and reticle effect
 * that appears when a body is clicked
 */
class BodyContextMenu extends ContextMenu {

  /**
   *
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {number[]} s0 The first content square to align elements in.
   * @param {number[]} s1 The second content square to align elements in.
   * @param {Body} body The body to highlight.
   */
  constructor(rect, s0, s1, body) {
    super(rect, s0, s1);

    this.body = body; // Body instance to focus
    if (!body.title) { body.title = 'body'; }
    if (!body.icon) { body.icon = circleIcon; }

    const w = 0.05;
    const topRight = [rect[0] + rect[2] - w, rect[1], w, w];

    const brs = 0.02;
    let bottomRight = [s1[0] + s1[2] - brs, s1[1] + s1[3] - brs, brs, brs];
    bottomRight = padRect(...bottomRight, 0.03);

    this.setChildren([

      new StatReadout(s0, body.icon, () => body.title),

      new IconButton(topRight, xIcon, () => this.closeBodyContextMenu())
        .withScale(0.5)
        .withTooltip('close menu'),

    ]);

    if (this.deleteEnabled()) {
      this.addChild(
        new IconButton(bottomRight, trashIcon, () => this.deleteBody())
          .withTooltip(`delete ${body.title}\n(no refunds)`)
          .withScale(0.5),
      );
    }
  }

  /**
   *
   */
  deleteEnabled() {
    return true;
  }

  /**
   *
   */
  deleteBody() {
    let b = this.body;
    while (b.parent) { b = b.parent; }// got top parent
    this.screen.sim.removeBody(b);
    this.closeBodyContextMenu();
  }

  /**
   *
   */
  closeBodyContextMenu() {
    const screen = this.screen;
    screen.contextMenu = null;
    screen.sim.selectedBody = null;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    super.draw(g);

    // debug
    // g.strokeRect(...this.square0)

    // draw reticle effect around body
    g.fillStyle = global.colorScheme.hl;
    const bod = this.body;
    const edge = bod.edge;
    const center = bod.pos;
    const thickness = 1e-2;

    // compute number of straight segments to draw
    const res = 500; // ~segs per screen length
    const n = Math.floor(edge.circ * res);

    // specs for stripe pattern. Stripes
    // and are made of multiple segments
    const nStripes = 20;
    const period = Math.floor(n / nStripes);
    const fill = Math.floor(period * 0.75);

    const animAng = global.t / 1e3; // anim state
    // space += 1e-2*Math.cos(animAng) // in-out anim
    const cdo = 6e-2 * animAng;// 1e-1*Math.sin(animAng/2) // slide anim

    let stripeShape = [];

    // iterate over segments
    for (let i = 0; i < n; i++) {
      const cd = cdo + i * edge.circ / n;
      const [eAngle, r, eNorm, _r2] = bod.edge.lookupDist(cd);
      const a = eAngle + bod.angle;
      const norm = eNorm + bod.angle;
      const outer = center.add(vp(a, r));
      const inner = outer.sub(vp(norm, thickness));

      const im = i % period;
      if (im === 0) {
        // start stripe
        stripeShape = [inner, outer];
      }
      else if (im < fill) {
        // mid stripe
        stripeShape.unshift(inner);
        stripeShape.push(outer);

      }
      else if (im === fill) {
        // finish stripe
        g.beginPath();
        stripeShape.forEach((p) => g.lineTo(...p.xy()));
        g.fill();

      }
      else {
        // between stripes
        // do nothing
      }
    }
  }
}
