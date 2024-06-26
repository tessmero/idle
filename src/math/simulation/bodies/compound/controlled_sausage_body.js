/**
 * @file ControlledSausageBody sausage with control points.
 */
class ControlledSausageBody extends CompoundBody {

  /**
   *
   * @param {ParticleSim} sim The simulation this will exist in.
   * @param {Vector} a The position of one end.
   * @param {Vector} b The position of the other end.
   * @param {number} rad Half of the thickness.
   */
  constructor(sim, a, b, rad = 2e-2) {
    super(sim, va(a, b));

    this.a = a;
    this.b = b;

    const sausage = new SausageBody(sim, a, b, rad);
    this.sausage = sausage;

    // init control points for user to click and drag
    this.movCp = new ControlPoint(sim, sausage);
    const r = a.sub(b).getMagnitude() / 2;
    this.rotCp0 = new RotationControlPoint(sim, sausage, 0, r);
    this.rotCp1 = new RotationControlPoint(sim, sausage, pi, r);
    this.controlPoints = [this.movCp, this.rotCp0, this.rotCp1];
    this.rotCp0.fscale = 6;
    this.rotCp1.fscale = 6;

    // this.constraints = [new Spring(this.rotCp0,this.rotCp1)]
    this.setChildren([sausage, ...this.controlPoints]);

  }

  /**
   *
   */
  getMainBody() { return this.sausage; }
}
