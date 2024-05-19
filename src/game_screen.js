
/**
 * on-screen rectangle
 * with sim, gui, and/or cursor
 *
 * e.g. the overall game screen
 * global.mainScreen
 */
class GameScreen {
  constructor(rect, sim, gui, tut) {
    this._rect = rect;
    this.sim = sim;
    this._gui = gui;
    this.tut = tut;
    this.drawOffset = [0, 0];

    // modal gui elements
    this.contextMenu = null;
    this.tooltipPopup = null;

    // floaters to draw on top of gui
    this.floaters = new FloaterGroup(100);

    // flag to pause the whole screen
    // may block gui
    // as apposed to this.sim.paused
    this.paused = false;
  }

  getRect() {
    return this._rect;
  }

  setRect(r) {
    // this._rect = [...r];
    this.drawOffset = [r[0] - this._rect[0], r[1] - this._rect[1]];

    if (this._gui) { this._gui.rect = r; }
  }

  getGui() {
    return this._gui;
  }

  setGui(gui) {
    this._gui = gui;
  }

  mouseDown(_e) {
    // context menu
    // (GuiElement instance)
    const gui = this.getGui();
    const cm = this.contextMenu;
    let clicked = false;
    if (cm) {
      clicked = cm.click();
      if (clicked) {
        // console.log('clicked context menu')
        return;
      }
    }

    clicked = gui.click();
    if (clicked) {
      // console.log('clicked fg gui')
      return;
    }

    // other gui in background of current gui
    const bgGui = gui.getBackgroundGui();
    if (bgGui) {
      clicked = bgGui.click();
    }
    if (clicked) {
      // console.log('clicked bg hud gui')
      return;
    }

    // console.log('click fell through all guis')
    // close the upgrades menu if it is open
    if ((this.sim === global.mainSim) && (global.gameState === GameStates.upgradeMenu)) { toggleStats(); }

    // may click simulation with selected tool
    const tool = this.sim.getTool();
    if (tool) { tool.mouseDown(global.mousePos); }

  }

  rebuildGui() { return null; }

  reset() {
    this.sim.reset();
    const tut = this.tut;
    if (tut) {
      tut.t = 0;
      tut.finished = false;
    }
    this.setGui(this.rebuildGui());
  }

  update(dt) {
    if (this.paused) { return; }

    const sim = this.sim;
    const gui = this.getGui();
    const tut = this.tut;

    // stop if game is paused
    if (global.gameState !== GameStates.pauseMenu) {

      sim.update(dt);

      if (tut) {

        if (tut.finished) {
          if (this.loop) {
            this.reset();
          }
          else {
            return;
          }
        }

        const tool = tut.tool;
        tool.sim = sim;
        sim.setTool(tool);
        tool.update(dt);
        const keyframes = tut.update(dt);
        let p = tut.getCursorPos().xy();
        const sr = sim.rect;
        p = v(sr[0] + p[0] * sr[2], sr[1] + p[1] * sr[3]);

        // emulate user input if necessary
        // (tutorial.js)
        keyframes.forEach((event) => {
          if (event[1] === 'down') { tool.mouseDown(p); }
          if (event[1] === 'up') { tool.mouseUp(p); }
          if (event[1] === 'primaryTool') { tut.tool = tut.primaryTool; }
          if (event[1] === 'defaultTool') { tut.tool = tut.defaultTool; }
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
      this.contextMenu.setScreen(this);

    }
    else if (gui && sim.selectedParticle) {
      const p = sim.selectedParticle;
      const [_subgroup, _i, x, y, _dx, _dy, _hit] = p;
      const rect = gui.getScreenEdgesForContextMenu();
      const cmr = ContextMenu.pickRects(rect, v(x, y));
      this.contextMenu = new PiContextMenu(...cmr, p);

    }

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
        if (global.gameState === GameStates.startTransition) {
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
      this.tooltipPopup.update(dt);
    }

  }

  draw(gfx) {

    // wrap graphics context if necessary
    // used for screen transition test
    let g = gfx;
    const gWrap = this.graphicsWrapper;
    if (gWrap) {
      g = gWrap.wrap(g);
    }

    const rect = this._rect;
    if (!rect) { return; }

    g.translate(...this.drawOffset);
    this.idraw(g, rect);
    g.translate(-this.drawOffset[0], -this.drawOffset[1]);
  }

  idraw(g, rect) {

    // clear canvas, unless gui requests not to
    const gui = this.getGui();
    const stopClear = gui ? gui.stopCanvasClear() : false;
    if (!stopClear) {
      g.clearRect(...rect);
    }

    g.fillStyle = global.colorScheme.fg;
    this.sim.draw(g);

    // start drawing main gui if applicable
    if (gui) {

      // if applicable, draw another gui in background
      // e.g. hud behind upgrade menu
      const bgGui = gui.getBackgroundGui();
      if (bgGui) {
        bgGui.draw(g);
      }

      // draw upgrade menu gui transition effect
      if (this === global.mainScreen) {
        global.allGuis[GameStates.upgradeMenu].drawTransitionEffect(g); // upgrade_menu.js
      }

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

    // draw real player cursor
    if (this === global.mainScreen) {
      const p = global.mousePos.xy();
      const tool = this.sim.getTool();
      if (tool) { tool.drawCursor(g, p); }
    }

    // draw automated cursor
    else if (this.tut) {
      const tut = this.tut;
      const tool = tut.tool;
      tool.sim = this.sim;
      let p = tut.getCursorPos().xy();
      const sr = this.sim.rect;
      p = [sr[0] + p[0] * sr[2], sr[1] + p[1] * sr[3]];
      if (tut.lastCursorPos) {
        const lp = tut.lastCursorPos;
        if ((p[0] !== lp[0]) || (p[1] !== lp[1])) {
          tool.mouseMove(v(...p));
        }
      }
      else {
        tut.lastCursorPos = p;
      }

      // pos in sim -> real screen pos
      tool.drawCursor(g, p, global.tutorialToolScale, false);

      // draw tool overlay if applicable
      if (tool.draw) {
        tool.draw(g);
      }
    }

    if (g.drawDebug) { g.drawDebug(); }

  }
}

