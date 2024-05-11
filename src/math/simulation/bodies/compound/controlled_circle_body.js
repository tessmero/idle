// a circle body with a control point
// for the player to click and drag
class ControlledCircleBody extends CompoundBody {

  // sim is a ParticleSim instance
  constructor(sim, pos, rad) {
    super(sim, pos);

    this.circle = new CircleBody(sim, pos, rad);
    const cp = new ControlPoint(sim, this.circle);
    cp.visible = true;
    cp.setRad(rad);
    this.controlPoint = cp;

    this.children = [this.circle, cp];
    this.controlPoints = [cp];
  }

  getMainBody() { return this.circle; }

  update(dt) {

    // request a particle to be eaten from edge
    // edge_particle_subgroup.js
    if (Math.random() < 0.1) { this.getMainBody().eatsQueued = 1; }

    return super.update(dt);
  }
}
