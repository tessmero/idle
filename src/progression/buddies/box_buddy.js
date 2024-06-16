/**
 * @file BoxBuddy object type and screen heirarchy
 *
 * A BoxBuddy existing in an active simulation
 * manifests a special outer->inner screen relationship
 */
const _allBoxScreenRels = new Map();
const _allScreenBoxes = new Map();

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
  expMechDesc = 'transfer raindrops in or out';

  #wasUnregistered;

  /**
   *
   * @param {ParticleSim} sim
   * @param {Vector} pos
   * @param {number} rad
   */
  constructor(sim, pos, rad) {
    super(sim, pos);

    // setup new inner screen
    const outerScreen = sim.screen;
    this.outerScreen = outerScreen;
    this.innerScreen = this._getInnerScreen(outerScreen);
    _allScreenBoxes.set(this.innerScreen, this);

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

    // detect double click on translation control point
    let lastClickTime = 0;
    this.movCp.clicked = () => {
      const t = global.t;
      const d = t - lastClickTime;
      if (d < 300) {
        this.enter();
      }
      lastClickTime = t;
    };

    // this.constraints = [new Spring(this.rotCp0,this.rotCp1)]
    this.setChildren([square, ...this.controlPoints]);

  }

  /**
   * Called in constructor.
   * Determines experience needed to advance through exp levels.
   * @returns {object} The ValueCurve instance.
   */
  getExpLevelCostCurve() {
    return ValueCurve.power(100, 2);
  }

  /**
   * Extend BuddyContextMenu (should add somehting).
   * @param {number[][]} rects The allignment rectangles for the menu.
   */
  buildContextMenu(rects) {
    const bcm = new BuddyContextMenu(...rects, this);
    return bcm;
  }

  /**
   *
   */
  enter() {
    const screen = this.outerScreen;
    const toSquare = (screen === global.rootScreen) ? [0, 0, 1, 1] : screen.rect;
    screen.stateManager.setState(GameStates.boxTransition,
      { fromSquare: BoxTransitionGui._car(this.square),
        toSquare: BoxTransitionGui._car(toSquare),
        toScreen: this.innerScreen,
      });
  }

  /**
   * Override standard buddy draw routine,
   * instead draw square and orientation arrow.
   * @param {object} g The graphics context.
   */
  draw(g) {
    const c = this.square.pos;
    const a = this.square.angle;
    const r = this.square.rad;
    BoxBuddy.drawBoxWithArrow(g, c, a, r);

    // draw control points
    this.controlPoints.forEach((cp) => cp.draw(g));
  }

  /**
   * Draw a square with an orientation arrow.
   * @param {object} g The graphics context.
   * @param {Vector} c The position of the center of the box.
   * @param {number} a The orientation of the box.
   * @param {number} r Half of the side length of the box.
   */
  static drawBoxWithArrow(g, c, a, r) {
    SquareBody.drawSquare(g, c, a, r);
    BoxBuddy._drawArrow(g, c, a, r);
  }

  /**
   * Draw the orientation arrow for a box buddy.
   * @param {object} g The graphics context.
   * @param {Vector} center The position of the center of the box.
   * @param {number} angle The orientation of the box.
   * @param {number} rad Half of the side length of the box.
   */
  static _drawArrow(g, center, angle, rad) {

    const r = 1;
    const rr = r / 2.5;
    const arrowShape = [
      [-rr, 1 - r],
      [-r, 1 - r], [0, 1], [r, 1 - r],
      [rr, 1 - r],
      [rr, -1], [-rr, -1],
    ];
    const offset = v(0, 1.2);
    const s = rad * 0.4;

    g.fillStyle = global.colorScheme.bg;
    g.beginPath();
    arrowShape.forEach(([x, y]) => {
      const p = center.add(v(x, y).add(offset).rotate(angle + pi).mul(s));
      g.lineTo(...p.xy());
    });
    g.closePath();
    g.fill();
    g.fillStyle = global.colorScheme.fg;
  }

  /**
   * Extend standard buddy update by updating inner screen.
   * @param {number} dt The time elapsed.
   */
  update(dt) {
    const outerSim = this.sim;
    const innerSim = this.innerScreen.sim;

    innerSim.particleG = outerSim.particleG.rotate(-this.square.angle);

    return super.update(dt);
  }

  /**
   * Inner Particle Out Of Bounds
   * Callback for when particle moves out of inner screen bounds
   * particle will be removed from inner sim no matter what
   * called in physics_particle_subgroup.js
   * @param {Vector} innerPos
   * @param {Vector} innerVel
   */
  _innerPoob(innerPos, innerVel) {

    if (this.#wasUnregistered) {

      // box is not in active sim
      // let particle escape to nowhere
      return;
    }

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
    pps.spawnParticle(pos, vel);
  }

  /**
   * Override this.square.grabbed() method.
   *
   * when particle hits square body edge
   * pass it into the inner sim
   * @param {...any} p Data about the particle.
   */
  grabbed(...p) {
    const [subgroup, i, _x, _y, dx, dy, hit] = p;
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
    pps.spawnParticle(pos, vel);
  }

  /**
   *
   */
  getMainBody() { return this.square; }

  /**
   * Extend standard buddy unregister.
   * Set flag so inner sim particles may escape to nowhere
   * @param {ParticleSim} sim
   */
  unregister(sim) {
    super.unregister(sim);
    this.#wasUnregistered = true;
  }

  /**
   * Create or reconnect inner screen. Called in constructor.
   * @param {GameScreen} outerScreen The screen containing this box.
   */
  _getInnerScreen(outerScreen) {
    const abis = _allBoxScreenRels;
    if (!abis.has(outerScreen)) {
      abis.set(outerScreen, []);
    }

    // count existing boxes (not including this)
    const bods = outerScreen.sim.bodies;
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
   * Create new inner screen. Called in _getInnerScreen().
   * @param {GameScreen} outerScreen
   * @param {number} boxIndex
   */
  _buildInnerScreen(outerScreen, boxIndex) {

    // prepare blank tutorial screen
    const sim = new BoxPSim();
    sim.usesGlobalCurrency = this.outerScreen.sim.usesGlobalCurrency;
    const gsm = new GameStateManager();// new BlankGSM();
    const macro = null;

    // set terminal velocity for physics particles
    sim.fallSpeed = outerScreen.sim.fallSpeed;

    const titleKey = `box ${boxIndex} in ${outerScreen.titleKey}`;
    const innerScreen = new GameScreen(titleKey, sim.rect, sim, gsm, macro);

    gsm.setState(GameStates.playing);
    sim.setTool(sim.toolList[0]);
    return innerScreen;
  }

  /**
   * Check performance log and execute hidden draws as
   * necessary to make sure all connected black box screens are updated
   * May2024 box persistence
   * @param {number} dt The time elapsed.
   */
  static ensureAllBoxesUpdated(dt) {

    const abis = _allBoxScreenRels;
    for (const [parent, children] of abis.entries()) {
      BoxBuddy._ensureScreenWasUpdated(parent, dt);
      for (const child of children) {
        BoxBuddy._ensureScreenWasUpdated(child, dt);
      }
    }

  }

  /**
   * Check live performance stats to see if the screen was just updated.
   * if necessary, update the given screen using a hidden draw.
   * @param {GameScreen} screen The screen in question.
   * @param {number} dt The time elapsed.
   */
  static _ensureScreenWasUpdated(screen, dt) {
    const lps = global.livePerformanceStats;
    const key = screen.titleKey;

    // check if the screen was updated
    if (!lps.activeScreens.has(key)) {

      // update screen
      screen.sim.update(dt);
      screen.sim.draw(null, true);
    }
  }

  /**
   * Find a screen that has a black box containing the given screen.
   * @param {GameScreen} screen The child screen who's parent should be found.
   */
  static getParentScreen(screen) {
    const abis = _allBoxScreenRels;
    for (const [parent, children] of abis.entries()) {
      if (children.includes(screen)) {
        return parent;
      }
    }
    return null;
  }
}
