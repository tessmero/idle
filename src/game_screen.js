/**
 * @file GameScreen object type
 *
 * a Game Screen is an on-screen rectangle
 * with some combination of sim, gui, and/or cursor
 *
 * instances are persistent and must be registered
 * contructor submits to global.logPerformanceStats
 *
 * methods like mouseDown recieve real user input (input.js)
 * or emulated user input (in this file!)
 *
 * e.g. the overall game screen
 * global.mainScreen
 */
class GameScreen {

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
    global.logPerformanceStats.submitNewScreen(titleKey, this);
    console.assert(gsm instanceof GameStateManager);
    console.assert(sim instanceof ParticleSim);

    this.title = titleKey;
    this._rect = rect;

    this.sim = sim;
    sim.screen = this;
    this.stateManager = gsm;

    if (gsm) {
      gsm.rebuildGuis(this);
    }
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

  }

  /**
   *
   */
  set titleKey(_ts) {
    throw new Error('not allowed');
  }

  /**
   *
   */
  get rect() {
    return this._rect;
  }

  /**
   *
   */
  set rect(_r) {
    throw new Error('should use setRect()');
  }

  /**
   *
   * @param r
   */
  setRect(r) {
    // this._rect = [...r];
    this.drawOffset = [r[0] - this._rect[0], r[1] - this._rect[1]];
    if (this._gui) { this._gui.rect = r; }
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
   * close any existing gui, switch to the given gui,
   * and call its setScreen() and open() src/gui/gui.js
   * @param {Gui} gui instance to show on this screen
   */
  setGui(gui) {

    // close previous gui
    const oldGui = this.gui;
    if (oldGui) {
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

    this.idleCountdown = this.idleDelay;

    // trigger selected tool movement behavior
    const tool = this.sim.getTool();
    if (tool) { tool.mouseMove(p); }
  }

  /**
   *
   */
  mouseUp() {

    // global.mainSim.getBodies().forEach(p => p.isHeld = false )

    // release tool if it was being held down
    const tool = this.sim.getTool();
    if (tool) { tool.mouseUp(this.mousePos); }

  }

  /**
   *
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
    if (this.stateManager && (this.stateManager.gameState === GameStates.upgradeMenu)) { this.stateManager.toggleStats(); }

    // may click simulation with selected tool
    const tool = this.sim.getTool();
    if (tool) { tool.mouseDown(this.mousePos); }

  }

  /**
   *
   */
  reset() {
    this.sim.reset();
    const macro = this.macro;
    if (macro) {
      macro.t = 0;
      macro.finished = false;
      const tool = macro.defaultTool;
      tool.held = false; // release mouse button
      this.sim.setTool(tool);
    }

    if (this.stateManager) {
      this.stateManager.rebuildGuis(this);
    }
  }

  /**
   *
   * @param dt
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
    if ((!this.stateManager) || (this.stateManager.gameState !== GameStates.pauseMenu)) {

      sim.update(dt);

      if (macro) {

        if (macro.finished) {
          if (this.loop) {
            this.reset();
          }
          else {
            return;
          }
        }

        const tool = macro.tool;
        tool.sim = sim;
        sim.setTool(tool);
        tool.update(dt);
        const keyframes = macro.update(dt);
        let p = macro.getCursorPos().xy();
        const sr = sim.rect;
        p = v(sr[0] + p[0] * sr[2], sr[1] + p[1] * sr[3]);
        this.mouseMove(p);

        // emulate user input if necessary
        // (tutorial.js)
        keyframes.forEach((event) => {
          if (event[1] === 'down') { this.mouseDown(p); }
          if (event[1] === 'up') { this.mouseUp(p); }
          if (event[1] === 'primaryTool') { macro.tool = macro.primaryTool; }
          if (event[1] === 'defaultTool') { macro.tool = macro.defaultTool; }
        });

        // like update.js
        // update control point hovering status
        sim.updateControlPointHovering(p);
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
    if (gui && sim.selectedBody) {
      const bod = sim.selectedBody;
      let bodPos = bod.pos;
      if (bod instanceof CompoundBody) {
        bodPos = bod.getMainBody().pos;
      }
      const rect = gui.getScreenEdgesForContextMenu();
      const cmr = ContextMenu.pickRects(rect, bodPos);

      if (bod instanceof Buddy) {
        this.contextMenu = new BuddyContextMenu(...cmr, bod);
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
      this.contextMenu = new PiContextMenu(...cmr, p);
    }

    if (this.contextMenu) { this.contextMenu.setScreen(this); }

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
        if (this.stateManager.gameState === GameStates.startTransition) {
          // skip bg hud updates during start transition
        }
        else {
          bgGui.update(dt, disableHover);
        }
      }
    }

    // trigger passive tool behavior
    const tool = sim.getTool();
    if (tool) { tool.update(dt); }

    // update popups just in case they are persistent
    if (this.tooltipPopup) {
      this.tooltipPopup.setScreen(this);
      this.tooltipPopup.update(dt);
    }

    // update menu gui transition effect
    const menuGui = this.stateManager.allGuis[GameStates.upgradeMenu];
    if (menuGui) { menuGui.updateTransitionEffect(dt); } // upgrade_menu.js

  }

  /**
   *
   * @param gfx
   */
  draw(gfx) {

    if (!this._rect) { return; }

    // wrap graphics context if necessary
    // used for screen transition test
    let g = gfx;
    const gWrap = this.graphicsWrapper;
    if (gWrap) {
      g = gWrap.wrap(g);
    }

    g.translate(...this.drawOffset);
    this.idraw(g);
    g.translate(-this.drawOffset[0], -this.drawOffset[1]);
  }

  /**
   *
   * @param g
   */
  idraw(g) {

    // clear canvas, unless gui requests not to
    const gui = this.gui;
    const stopClear = gui ? gui.stopScreenClear() : false;
    if (!stopClear) {
      g.clearRect(...this.rect);
    }

    // draw screen
    this.sim.draw(g);
    if (!stopClear) {
      this._drawGui(g);
    }
    this._drawCursor(g);
  }

  /**
   *
   * @param g
   */
  _drawCursor(g) {
    // draw  cursor
    if (this.mousePos) {
      const p = this.mousePos.xy();
      const tool = this.sim.getTool();
      if (tool) {
        if (this.sim === global.mainSim) {
          tool.drawCursor(g, p);
        }
        else {
          tool.drawCursor(g, p, global.tutorialScaleFactor, false);
        }
      }
    }

    // draw automated cursor
    else if (this.macro) {
      const macro = this.macro;
      const tool = macro.tool;
      tool.sim = this.sim;
      let p = macro.getCursorPos().xy();
      const sr = this.sim.rect;
      p = [sr[0] + p[0] * sr[2], sr[1] + p[1] * sr[3]];
      if (macro.lastCursorPos) {
        const lp = macro.lastCursorPos;
        if ((p[0] !== lp[0]) || (p[1] !== lp[1])) {
          tool.mouseMove(v(...p));
        }
      }
      else {
        macro.lastCursorPos = p;
      }

      // draw tool overlay if applicable
      if (tool.draw) {
        tool.draw(g);
      }
    }
  }

  /**
   * draw gui and cursor
   * @param g
   */
  _drawGui(g) {
    const gui = this.gui;

    // start drawing main gui if applicable
    if (gui) {

      // if applicable, draw another gui in background
      // e.g. hud behind upgrade menu
      const bgGui = gui.getBackgroundGui();
      if (bgGui) {
        bgGui.draw(g);
      }

      // draw upgrade menu gui transition effect
      const menuGui = this.stateManager.allGuis[GameStates.upgradeMenu];
      if (menuGui) { menuGui.drawTransitionEffect(g); } // upgrade_menu.js

      // draw current gui
      g.lineWidth = global.lineWidth;
      gui.draw(g);
    }

    // draw modal gui popups
    if (this.contextMenu) {
      this.contextMenu.draw(g);
    }
    if (this.tooltipPopup) {
      this.tooltipPopup.draw(g);
    }

    // draw gui floaters on top of gui
    this.floaters.draw(g);

    if (g.drawDebug) { g.drawDebug(); }
  }
}

