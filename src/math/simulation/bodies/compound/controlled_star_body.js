class ControlledStarBody extends CompoundBody {

  // sim is a ParticleSim instance
  constructor(sim, pos, n, minRad, maxRad) {
    super(sim, pos);

    const star = new StarBody(sim, pos, n, minRad, maxRad);
    this.star = star;

    // init control points for user to click and drag
    this.movCp = new ControlPoint(sim, star);
    const r = maxRad;
    this.rotCp0 = new RotationControlPoint(sim, star, pi / n / 2, r);
    this.controlPoints = [this.movCp, this.rotCp0];
    this.rotCp0.fscale = 6;

    // this.constraints = [new Spring(this.rotCp0,this.rotCp1)]
    this.children = [star, ...this.controlPoints];

    this.dripChance = global.poiDripChance;
  }

  getMainBody() { return this.star; }
}
