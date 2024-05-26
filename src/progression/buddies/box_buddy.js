/**
 * @file BoxBuddy object type and screen heirarchy
 *
 * A BoxBuddy existing in an active simulation
 * manifests a special outer->inner screen relationship
 */
const _allBoxInternalScreens = new Map();

/**
 * BoxBuddy
 *
 * square body with control points
 * also contains persistent internal screen and sim
 * inner screen may be displayed in context menu
 *
 * edge of body passes rain to inner sim
 * edge of inner screen passes rain to outer sim
 * body orientation and accel = "gravity" for inner sim
 */
class BoxBuddy extends Buddy {

  /**
   *
   * @param sim
   * @param pos
   * @param rad
   */
  constructor(sim, pos, rad) {
    super(sim, pos);

    // setup new inner screen
    const outerScreen = sim.screen;
    this.innerScreen = this._getInnerScreen(outerScreen);

    // override callback for inner sim
    const innerSim = this.innerScreen.sim;
    innerSim.physicsParticlePassedOffscreen = (...p) => this._innerPoob(...p);

    // start with base square
    const square = new SquareBody(sim, pos, rad);
    square.title = 'black box';
    this.square = square;

    // outer/inner square lenght ratio
    const innerRad = this.innerScreen.sim.rect[2] / 2;
    this.rad = rad;
    this.scaleFactor = innerRad / rad;

    // override grabbed method
    // which normally handles particles hitting edge
    square.grabbed = (...p) => this.grabbed(...p);

    // init control points for user to click and drag
    this.movCp = new ControlPoint(sim, square);
    this.rotCp0 = new RotationControlPoint(sim, square, -pio2, rad * 2);
    this.controlPoints = [this.movCp, this.rotCp0];
    this.rotCp0.fscale = 6;

    // this.constraints = [new Spring(this.rotCp0,this.rotCp1)]
    this.children = [square, ...this.controlPoints];
    this.dripChance = global.poiDripChance;
  }

  /**
   * Draw orientation arrow on top of standard Buddy
   * @param g
   */
  draw(g) {
    super.draw(g);
    const r = 1;
    const rr = r / 2.5;
    const arrowShape = [
      [-rr, 1 - r],
      [-r, 1 - r], [0, 1], [r, 1 - r],
      [rr, 1 - r],
      [rr, -1], [-rr, -1],
    ];
    const offset = v(0, 1.2);
    const s = this.rad * 0.4;

    g.fillStyle = global.colorScheme.bg;
    g.beginPath();
    arrowShape.forEach(([x, y]) => {
      const pos = this.square.pos.add(v(x, y).add(offset).rotate(this.square.angle + pi).mul(s));
      g.lineTo(...pos.xy());
    });
    g.closePath();
    g.fill();
    g.fillStyle = global.colorScheme.fg;
  }

  /**
   * Update inner screen, in addition to standard Buddy update.
   * @param {number} dt The time elapsed.
   */
  update(dt) {

    const outerSim = this.sim;
    const innerSim = this.innerScreen.sim;

    innerSim.particleG = outerSim.particleG.rotate(-this.square.angle);
    innerSim.update(dt);

    // 05/26/2024 hack to make persistence work
    // check if the inner sim will be drawn in gui
    if (outerSim.selectedBody !== this) {

      // execute hidden draw
      innerSim.draw(null, true);
    }

    return super.update(dt);
  }

  /**
   * Inner Particle Out Of Bounds
   * Callback for when particle moves out of inner screen bounds
   * particle will be removed from inner sim no matter what
   * called in physics_particle_subgroup.js
   * @param innerPos
   * @param innerVel
   */
  _innerPoob(innerPos, innerVel) {

    // translate to outer sim coordinates
    const bod = this.square;
    const angle = bod.angle;
    const innerCenter = v(...rectCenter(...this.innerScreen.sim.rect));
    const scale = this.scaleFactor;
    const pos = bod.pos.add(innerPos.sub(innerCenter).mul(1 / scale).rotate(angle));
    const vel = innerVel.rotate(angle);

    // add particle to outer sim
    const outerSim = this.sim;
    const pps = outerSim.leftoverPPS;
    this.particlesCollected = this.particlesCollected - 1;
    pps.spawnParticle(pos, vel);
  }

  /**
   * Override this.square.grabbed() method.
   *
   * when particle hits square body edge
   * pass it into the inner sim
   * @param subgroup
   * @param i
   * @param x
   * @param y
   * @param dx
   * @param dy
   * @param hit 1D position along circumference
   */
  grabbed(subgroup, i, x, y, dx, dy, hit) {
    const innerSim = this.innerScreen.sim;
    const edge = this.square.edge;

    // compute position for particle in innerSim
    const [ea, er, _norm] = edge.lookupDist(hit);
    const innerC = v(...rectCenter(...innerSim.rect));
    const scale = this.scaleFactor;
    const pos = innerC.add(vp(ea, er * scale));

    // compute velocity for particle in innerSim
    let vel;
    if (subgroup === null) {

      // particle was procedural
      const speed = innerSim.fallSpeed;
      vel = v(0, speed);
    }
    else if (subgroup instanceof EdgeParticleSubgroup) {
      const [_xyPos, xyVel] = subgroup.getXyPosVel(i);
      vel = xyVel;
    }
    else if (isNaN(dx)) {
      vel = v(0, 0);
    }
    else {
      vel = v(dx, dy);
    }

    // account for box orientation
    vel = vel.rotate(-this.square.angle);

    // add particle to inner sim
    const pps = innerSim.leftoverPPS;
    this.particlesCollected = this.particlesCollected + 1;
    pps.spawnParticle(pos, vel);
  }

  /**
   *
   */
  getMainBody() { return this.square; }

  /**
   * Called in constructor.
   * @param outerScreen The screen containing this box.
   */
  _getInnerScreen(outerScreen) {
    const abis = _allBoxInternalScreens;
    if (!abis.has(outerScreen)) {
      abis.set(outerScreen, []);
    }

    // count existing boxes (not including this)
    const bods = outerScreen.sim.getBodies();
    const boxes = [...bods].filter((b) => b instanceof BoxBuddy);
    const boxIndex = boxes.length;

    // count existing screens
    const existingScreens = abis.get(outerScreen);
    console.assert(boxIndex <= existingScreens.length);
    if (boxIndex === existingScreens.length) {
      const myScreen = this._buildInnerScreen(outerScreen, boxIndex);
      existingScreens.push(myScreen);
    }

    // use new or existing screen
    return existingScreens[boxIndex];
  }

  /**
   *
   * @param {GameScreen} outerScreen
   * @param {number} boxIndex
   */
  _buildInnerScreen(outerScreen, boxIndex) {

    // prepare blank tutorial screen
    const sim = new TutorialPSim();
    const gsm = GameStateManager.blankGsm();
    const macro = null;

    // disable procedural particles
    sim.rainGroup.n = 0;

    // set terminal velocity for physics particles
    sim.fallSpeed = outerScreen.sim.fallSpeed;

    const titleKey = `box ${boxIndex} in ${outerScreen.title}`;
    const innerscreen = new GameScreen(titleKey, sim.rect, sim, gsm, macro);
    return innerscreen;
  }
}
