/**
 *
 */
class ControlledCompassBody extends CompoundBody {

  // sim is a ParticleSim instance
  /**
   *
   * @param sim
   * @param pos
   */
  constructor(sim, pos) {
    super(sim, pos);

    const comp = new CompassBody(sim, pos);
    this.comp = comp;

    // init control points for user to click and drag
    this.movCp = new ControlPoint(sim, comp);
    this.rotCp0 = new RotationControlPoint(sim, comp, 0, 0.1);
    this.controlPoints = [this.movCp, this.rotCp0];
    this.rotCp0.fscale = 6;

    this.children = [comp, ...this.controlPoints];

    this.dripChance = global.poiDripChance;
  }

  /**
   *
   */
  getMainBody() { return this.comp; }
}
