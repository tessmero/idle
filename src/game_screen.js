/**
 * @file GameScreen object type
 *
 * a Game Screen is an on-screen rectangle
 * with some combination of sim, gui, and/or cursor
 *
 * e.g. the overall game screen: global.mainScreen
 *
 * instances are persistent and must be registered
 * contructor submits to global.logPerformanceStats
 *
 * methods like mouseDown recieve real user input (input.js)
 * or emulated user input (in this file)
 */
class GameScreen {

  #stateManager;
  #titleKey;
  #rect;

  /**
   *
   */
  get iconScale() {
    return ((this === global.mainScreen) ?
      1 : global.tutorialScaleFactor);
  }

  /**
   * Create a new Game Screen
   * @param {string} titleKey readable title, also used as
   *                          key for performance log.
   * @param {number[]} rect
   * @param {ParticleSim} sim
   * @param {GameStateManager} gsm
   * @param {Macro} macro
   */
  constructor(titleKey, rect, sim, gsm, macro) {
    this.#titleKey = titleKey;
    this.#rect = rect;

    global.logPerformanceStats.submitNewScreen(this);
    console.assert(gsm instanceof GameStateManager);
    console.assert(sim instanceof ParticleSim);

    this.sim = sim;
    sim.screen = this;
    this.#stateManager = gsm;

    const grabRad = global.rootScreen ? global.rootScreen.toolList[0].rad : global.mouseGrabRadius;
    this.toolList = [
      new DefaultTool(this, grabRad),
      new CircleTool(this),
      new LineTool(this),
      new BoxTool(this),
      new PiTool(this, grabRad),
      new ExpTool(this),
    ];

    this.macro = macro;
    this.drawOffset = [0, 0];

    // modal gui elements
    this.contextMenu = null;
    this.tooltipPopup = null;

    // start animating mouse cursor if idle
    this.idleCountdown = 2000; // state
    this.idleDelay = 2000; // ms

    // floaters to draw on top of gui
    this.floaters = new FloaterGroup(100);

    if (gsm) {
      gsm.rebuildGuis(this);
    }
  }

  /**
   * Get the tool currently represented by the cursor.
   */
  get tool() {
    return this._tool;
  }

  /**
   * Prevent changing tool with equal sign.
   */
  set tool(_t) {
    throw new Error('should use setTool');
  }

  /**
   * Unregister the current tool and switch to the new tool.
   * @param {Tool} t The new tool show for the cursor for this sim
   */
  setTool(t) {
    const prev = this._tool;
    if (t === prev) { return; }

    if (prev) {
      prev.held = false;
      prev.unregister(this.sim);
    }
    this._tool = t;
    if (t) {
      t.held = false;
      t.setScreen(this);
    }
  }

  /**
   *
   */
  get stateManager() { return this.#stateManager; }

  /**
   * Prevent setting state with equals sign.
   */
  set state(_s) { throw new Error('should use stateManager.setState()'); }

  /**
   * Allow accessing state property as shorthand,
   * @returns {GameState} The current state.
   */
  get state() { return this.#stateManager.state; }

  /**
   *
   */
  set titleKey(_t) {
    throw new Error('not allowed');
  }

  /**
   *
   */
  get titleKey() {
    return this.#titleKey;
  }

  /**
   *
   */
  set title(_t) {
    throw new Error('not allowed');
  }

  /**
   *
   */
  get title() {
    throw new Error('should use titleKey');
  }

  /**
   *
   */
  get rect() {
    return this.#rect;
  }

  /**
   *
   */
  set rect(_r) {
    throw new Error('should use setRect()');
  }

  /**
   *
   * @param {number[]} r
   */
  setRect(r) {
    this.drawOffset = [r[0] - this.#rect[0], r[1] - this.#rect[1]];
  }

  /**
   *
   */
  set _rect(_r) {
    throw new Error('should use setMainScreenRect()');
  }

  /**
   * Set bounding rectangle only if this is the root screen.
   * @param {number[]} r The new bounding x,y,w,h.
   */
  setMainScreenRect(r) {
    if (this === global.rootScreen) {
      // hack to update main sim size
      // noramlly sims don't change size
      this.#rect = [...r];
      this.sim._rect = screen.rect;
    }
  }

  /**
   * get the Gui instance currently on this screen
   */
  get gui() {
    return this._gui;
  }

  /**
   *
   */
  set gui(_) {
    throw new Error('should use setGui()');
  }

  /**
   * close() any existing gui, switch to the given gui,
   * then call gui's setScreen() and open()
   * @param {Gui} gui instance to show on this screen
   */
  setGui(gui) {

    // close previous gui
    const oldGui = this.gui;
    if (oldGui && (oldGui.title !== gui.title)) {
      oldGui.close();
    }

    // switch to new gui
    this._gui = gui;
    if (gui) {
      gui.setScreen(this);
      gui.open();
    }
  }

  /**
   *
   * @param {Vector} p mouse position
   */
  mouseMove(p) {
    this.mousePos = p;

    // reset idle countdown
    this.idleCountdown = this.idleDelay;

    // trigger selected tool movement behavior
    const tool = this.tool;
    if (tool) { tool.mouseMove(p); }
  }

  /**
   * Called when mouse button is released
   */
  mouseUp() {

    // release tool if it was being held down
    const tool = this.tool;
    if (tool) { tool.mouseUp(this.mousePos); }

  }

  /**
   * Called when mouse button is pressed
   */
  mouseDown() {
    // context menu
    // (GuiElement instance)
    const gui = this.gui;
    const cm = this.contextMenu;
    let clicked = false;
    if (cm) {
      clicked = cm.click();
      if (clicked) {
        // console.log('clicked context menu')
        return;
      }
    }

    clicked = gui ? gui.click() : false;
    if (clicked) {
      // console.log('clicked fg gui')
      return;
    }

    if (gui && gui.blockClickThrough) {
      if (gui.blockClickThrough()) {
        return;
      }
    }

    // other gui in background of current gui
    const bgGui = gui ? gui.getBackgroundGui() : null;
    if (bgGui) {
      clicked = bgGui.click();
    }
    if (clicked) {
      // console.log('clicked bg hud gui')
      return;
    }

    // console.log('click fell through all guis')
    // close the upgrades menu if it is open
    const sm = this.stateManager;
    if (sm && (sm.state === GameStates.upgradeMenu)) {
      sm.toggleStats();
    }

    // may click simulation with selected tool
    const tool = this.tool;
    if (tool) { tool.mouseDown(this.mousePos); }

  }

  /**
   *
   */
  reset() {
    this.sim.reset();
    this.setTool(null);

    const macro = this.macro;
    if (macro) {
      macro.t = 0;
      macro.finished = false;
    }

    if (this.stateManager) {
      this.stateManager.rebuildGuis(this);
    }
  }

  /**
   *
   * @param {number} dt The time elapsed in millisecs.
   */
  update(dt) {

    // advance countdown for user to be considered idle
    if (this.idleCountdown > 0) {
      this.idleCountdown = this.idleCountdown - dt;
    }

    const sim = this.sim;
    const gui = this.gui;
    const macro = this.macro;

    // stop if game is paused
    if ((!this.stateManager) || (this.stateManager.state !== GameStates.pauseMenu)) {

      sim.update(dt);

      if (macro) {
        this._updateMacro(sim, macro, dt);
      }
    }

    // delete popups, knowing that any persistent
    // popups will be reinstated below
    if (!(this.contextMenu instanceof TestContextMenu)) {
      this.contextMenu = null;
    }
    this.tooltipPopup = null;

    // update context menu
    // if (global.gameState !== GameStates.playing) {
    //   sim.selectedBody = null;
    // }
    if (gui && sim.selectedBody && (this === global.mainScreen)) {
      const bod = sim.selectedBody;
      let bodPos = bod.pos;
      if (bod instanceof CompoundBody) {
        bodPos = bod.getMainBody().pos;
      }
      const rect = gui.getScreenEdgesForContextMenu();
      const cmr = ContextMenu.pickRects(rect, bodPos);

      if (bod instanceof Buddy) {
        this.contextMenu = bod.buildContextMenu(cmr);
      }
      else {
        this.contextMenu = new BodyContextMenu(...cmr, bod);
      }

    }
    else if (gui && sim.selectedParticle) {
      const p = sim.selectedParticle;
      const [_subgroup, _i, x, y, _dx, _dy, _hit] = p;
      const rect = gui.getScreenEdgesForContextMenu();
      const cmr = ContextMenu.pickRects(rect, v(x, y));
      this.contextMenu = new PiContextMenu(...cmr, this, p);
    }

    if (this.contextMenu) { this.contextMenu.buildElements(this); }

    // update popups just in case they are persistent
    let disableHover = false;
    if (this.contextMenu) {
      disableHover = this.contextMenu.update(dt, disableHover);
    }

    // update main gui
    if (gui) {
      disableHover = gui.update(dt, disableHover) || disableHover;

      // if applicable, update another gui in background
      // e.g. hud behind upgrade menu
      const bgGui = gui.getBackgroundGui();
      if (bgGui) {
        if (this.stateManager.state === GameStates.startTransition) {
          // skip bg hud updates during start transition
        }
        else {
          bgGui.update(dt, disableHover);
        }
      }
    }

    // trigger passive tool behavior
    const tool = this.tool;
    if (tool) { tool.update(dt); }

    // update popups just in case they are persistent
    if (this.tooltipPopup) {
      this.tooltipPopup.buildElements(this);
      this.tooltipPopup.update(dt);
    }

    // update menu gui transition effect
    const menuGui = this.stateManager.getGuiForState(GameStates.upgradeMenu);
    if (menuGui) { menuGui.updateTransitionEffect(dt); } // upgrade_menu.js

  }

  /**
   * Called in update()
   * @param {ParticleSim} sim
   * @param {Macro} macro
   * @param {number} dt The time elapsed in millisecs.
   */
  _updateMacro(sim, macro, dt) {

    if (macro.finished) {
      if (this.loop) {
        this.reset();
      }
      else {
        return;
      }
    }

    const keyframes = macro.update(dt);

    // emulate mouse movement
    let p = macro.getCursorPos();
    const sr = sim.rect;
    p = v(sr[0] + p.x * sr[2], sr[1] + p.y * sr[3]);
    this.mouseMove(p);

    // emulate other user input if necessary
    // (tutorial.js)
    keyframes.forEach((event) => {
      if (event[1] === 'down') { this.mouseDown(p); }
      if (event[1] === 'up') { this.mouseUp(p); }
      if (event[1] === 'tool') { this.setTool(this.getTool(event[2])); }
    });

    // like update.js
    // update control point hovering status
    sim.updateControlPointHovering(p);
  }

  /**
   * Find owned tool matching the given class.
   * @param {object} clazz The tool subclass to search for.
   * @returns {?Tool} The matching tool instance.
   */
  getTool(clazz) {
    return this.toolList.find((t) => t instanceof clazz);
  }

  /**
   *
   * @param {object} gfx The graphics context.
   * @param {boolean} hideGui True if the gui should not be drawn.
   */
  draw(gfx, hideGui = false) {

    if (!this.#rect) { return; }

    // wrap graphics context if necessary
    // used for screen transition test
    let g = gfx;
    const gWraps = this.graphicsWrappers;
    if (gWraps) {
      gWraps.forEach((gw) => { g = gw.wrap(g); });
    }

    g.translate(...this.drawOffset);
    this.idraw(g, hideGui);
    g.translate(-this.drawOffset[0], -this.drawOffset[1]);
  }

  /**
   *
   * @param {object} g The graphics context.
   * @param {boolean} hideGui True if the gui should not be drawn.
   */
  idraw(g, hideGui) {

    // clear canvas, unless gui requests not to
    const gui = this.gui;
    const stopClear = gui ? gui.stopScreenClear() : false;
    if (!stopClear) {

      // make sure the whole screen is cleared,
      // in case this is the main screen and we are
      // inside a box with dimensions
      // not matching the users's physical screen
      const clearRect = (this === global.mainScreen) ?
        global.rootScreen.rect : this.rect;
      g.clearRect(...clearRect);
    }

    // draw screen
    this.sim.draw(g);
    if ((!stopClear) && (!hideGui)) {
      this._drawGui(g);
    }
    this._drawCursor(g);
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  _drawCursor(g) {
    const tool = this.tool;
    const p = this.mousePos;
    if (!p) { return; }
    if (tool) {
      tool.drawCursor(g, p);

      // draw tool overlay if applicable
      if (tool.draw) {
        tool.draw(g);
      }
    }
  }

  /**
   * Recursively draw background Guis as necessary. (e.g. hud behind upgrade menu)
   * @param {object} g The graphics context.
   * @param {Gui} gui The gui whose foreground was just drawn.
   */
  _drawBgGui(g, gui) {
    const bgGui = gui.getBackgroundGui();
    if (bgGui) {
      bgGui.draw(g);
      this._drawBgGui(g, bgGui);
    }
  }

  /**
   * draw gui and cursor
   * @param {object} g The graphics context.
   */
  _drawGui(g) {
    const gui = this.gui;

    // start drawing main gui if applicable
    if (gui) {

      this._drawBgGui(g, gui);

      // draw upgrade menu gui transition effect
      const menuGui = this.stateManager.getGuiForState(GameStates.upgradeMenu);
      if (menuGui) { menuGui.drawTransitionEffect(g); } // upgrade_menu.js

      // draw current gui
      g.lineWidth = global.lineWidth;
      gui.draw(g);
    }

    if (gui && (!gui.blocksPopups)) {
      // draw modal gui popups
      if (this.contextMenu) {
        this.contextMenu.draw(g);
      }
      if (this.tooltipPopup) {
        this.tooltipPopup.draw(g);
      }
    }

    // draw gui floaters on top of gui
    this.floaters.draw(g);

    // draw debug overlay
    // if the graphics context has been wrapped
    // used for transition test
    if (g.drawDebug) { g.drawDebug(g); }
  }
}

