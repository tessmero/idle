/**
 * @file BodyContextMenu gui element
 * context menu and reticle effect
 * that appears when a body is clicked
 */
class BodyContextMenu extends ContextMenu {
  _layoutData = BODY_CONTEXT_MENU_LAYOUT;

  #body;

  /**
   *
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {Body} body The body to highlight.
   */
  constructor(rect, body) {
    super(rect);

    this.#body = body;
  }

  /**
   * Pick categorical title to show in small font at top of context menu.
   */
  _miniTitle() {
    return 'Basic Shape';
  }

  /**
   * Construct gui element aligned with artArea
   */
  _buildArtElem() {
    return new BodyPreviewElement(this._layout.artArea, {
      body: this.#body,
      border: new RoundedBorder(),
    });
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const body = this.#body;
    const layout = this._layout;
    const [_s0, _s1] = layout.squares;
    if (!body.title) { body.title = 'body'; }
    if (!body.icon) { body.icon = circleIcon; }

    const result = [

      this._buildArtElem(),

      new TextLabel(layout.miniTitle, {
        label: this._miniTitle(),
        scale: 0.15,
        center: false,
      }),

      new TextLabel(layout.title, {
        label: body.title,
        scale: 0.4,
        center: false,
      }),

      new IconButton(layout.closeBtn, {
        icon: xIcon,
        action: () => this.closeBodyContextMenu(),
        scale: 0.4,
        tooltip: 'close menu',
      }),

    ];

    if (this.deleteEnabled()) {
      result.push(
        new IconButton(layout.trashBtn, {
          icon: trashIcon,
          action: () => this.deleteBody(),
          tooltip: `delete ${body.title}\n(no refunds)`,
          scale: 0.5,
        })
      );
    }

    return result;
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
    let b = this.#body;
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
    const bod = this.#body;
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
