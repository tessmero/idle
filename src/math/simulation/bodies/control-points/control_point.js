
/**
 * @file ControlPoint object type.
 * Body with no direct interaction with particles.
 * The user can click and drag to move or rotate another body.
 */
class ControlPoint extends Body {

  /**
   * anchoredTo is a body that this will be anchored to
   * @param sim
   * @param anchoredTo
   */
  constructor(sim, anchoredTo) {
    super(sim, anchoredTo.pos);
    this.anchoredTo = anchoredTo;
    this.setRad(this.sim.controlPointRadius);
    this.visible = true;
    this.fscale = 1;
  }

  /**
   *
   * @param r
   */
  setRad(r) {
    this.rad = r;
    this.r2 = Math.pow(this.rad, 2);
  }

  /**
   *
   * @param {object} g The graphics context.
   * @param color
   * @param forceDraw
   */
  draw(g, color = null, forceDraw = false) {
    const screen = this.sim.screen;
    if (!forceDraw) {
      if (!this.visible) { return; }
      if (this.sim.draggingControlPoint) { return; }
      if (screen.idleCountdown <= 0) { return; }
    }
    this.constructor._draw(g, this.pos, this.rad,
      screen.mousePos, color, forceDraw);
  }

  /**
   *
   * @param {object} g The graphics context.
   * @param pos
   * @param rad
   * @param mousePos
   * @param col
   * @param forceDraw
   */
  static _draw(g, pos, rad, mousePos,
    col = null, forceDraw = false) {

    let color = col;
    if (!color) { color = global.colorScheme.fg; }

    const c = pos;

    let start = 0;
    let stop = twopi;

    // only draw in certain range of mouse
    if (!forceDraw) {

      // skip hover effect for gui simulations
      if (!mousePos) { return; }

      const ia = intersectionAngles( // util.js
        ...pos.xy(), rad,
        ...mousePos.xy(),
        global.controlPointVisibleHoverRadius);
      if (ia === 'out') { return; }
      if ((ia !== 'in') && ia[0]) {
        stop = ia[0];
        start = ia[1];
      }
    }

    g.strokeStyle = color;
    g.lineWidth = global.controlPointLineWidth;
    g.beginPath();
    g.moveTo(...pos.add(vp(start, rad)).xy());
    g.arc(...c.xy(), rad, start, stop);
    g.stroke();

  }

  /**
   * pass user input force to physics-enabled parent body
   * @param acc
   */
  accel(acc) {
    this.anchoredTo.accel(acc.mul(this.fscale));
  }

  /**
   * remain stuck to parent
   * @param _dt
   */
  update(_dt) {
    this.pos = this.anchoredTo.pos;
  }

  /**
   * no direct interaction with particles
   * @param _sim
   */
  register(_sim) {}

  /**
   * no direct interaction with particles
   * @param _sim
   */
  unregister(_sim) {}

}
