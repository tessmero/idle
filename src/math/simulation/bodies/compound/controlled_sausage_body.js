/**
 * @file ControlledSausageBody sausage with control points.
 */
class ControlledSausageBody extends CompoundBody {

  /**
   *
   * @param {ParticleSim} sim The simulation this will exist in.
   * @param {Vector} pos The position of the center of the sausage.
   */
  constructor(sim, pos) {
    super(sim, pos);

    const sausage = new SausageBody(sim, pos);
    this.sausage = sausage;

    // init control points for user to click and drag
    this.movCp = new ControlPoint(sim, sausage);
    const r = SausageEdge.length() / 2;
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
