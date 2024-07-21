/**
 * @file SquareBody square-shaped body
 */
class SquareBody extends Body {
  _edgeKey = 'square';

  /**
   *
   */
  static rad() {
    return 0.05;
  }

  /**
   *
   * @param {ParticleSim} sim The simulation the body will live in.
   * @param {Vector} pos The position of the center of the square.
   */
  constructor(sim, pos) {
    super(sim, pos);

    this.rad = SquareBody.rad();
    this.title = 'square';
    this.icon = uncheckedIcon;
  }

  /**
   *
   */
  buildEdge() {

    const r = SquareBody.rad();

    let verts = [
      [r, r], [-r, r], [-r, -r], [r, -r],
    ];

    verts = verts.map((xy) => v(...xy));
    this.verts = verts;

    return new PolygonEdge('square', verts);
  }

  /**
   * Override standard body draw routine.
   * @param {object} g The graphics context.
   */
  draw(g) {
    const c = this.pos;
    const a = this.angle;
    const r = this.rad;
    SquareBody.drawSquare(g, c, a, r);
  }

  /**
   * Draw rotated square shape.
   * @param {object} g The graphics context.
   * @param {Vector} center The position of the center of the square.
   * @param {number} angle The orientation of the square.
   * @param {number} rad Half of the side length of the square.
   */
  static drawSquare(g, center, angle, rad) {
    g.fillStyle = global.colorScheme.fg;
    SquareBody.traceSquare(g, center, angle, rad);
    g.fill();
  }

  /**
   * Trace path of rotated square shape.
   * @param {object} g The graphics context.
   * @param {Vector} center The position of the center of the square.
   * @param {number} angle The orientation of the square.
   * @param {number} rad Half of the side length of the square.
   */
  static traceSquare(g, center, angle, rad) {
    g.beginPath();
    for (let i = 0; i < 4; i++) {
      const p = center.add(vp(angle + pio2 * (i + 0.5), rad * sqrt2));
      g.lineTo(...p.xy());
    }
    g.closePath();
  }
}
