/**
 * @file GameScreen object type
 *
 * a Game Screen is an on-screen rectangle
 * with some combination of sim, gui, and/or cursor
 *
 * e.g. the overall game screen: global.mainScreen
 *
 * instances are persistent and must be registered
 * constructor submits to ScreenManager()
 *
 * methods like mouseDown receive real user input (input.js)
 * or emulated user input (in this file)
 */
class GameScreen {
  #titleKey;

  #stateManager;
  #soundManager; // audio context
  #sounds; // handles for some common sounds
  #rect;

  #contextMenu = null;

  #layoutActors = {};

  #tempTooltip;
  #tempTooltipEndTime;

  // keys are gui element titleKeys
  // values are objects with whatever properties
  #persistentStates = {};

  /**
   * Temporarily override the normal tooltip text.
   * Reverts after the user stops hovering or some time passes.
   * @param {string} s The temporary tooltip text.
   */
  setTemporaryTooltip(s) {
    this.#tempTooltip = s;
    this.#tempTooltipEndTime = global.t + 1000; // millisecs
  }

  /**
   *
   * @param {string|GuiElement} newTooltip
   * @param {number} tooltipScale
   */
  constructTooltipElement(newTooltip, tooltipScale = 1) {

    // reset temporary tooltip if necessary
    if (global.t > this.#tempTooltipEndTime) { this.#tempTooltip = null; }

    // choose temporary tooltip or given tooltip
    const tooltip = this.#tempTooltip ? this.#tempTooltip : newTooltip;

    if (tooltip instanceof Tooltip) {

      // given tooltip is already gui element
      this.tooltip = tooltip;
    }
    else if ((typeof tooltip === 'string' || tooltip instanceof String)) {

      // build standard tooltip gui element
      let rect = LabelTooltip.pickRect(this, tooltip, tooltipScale);
      rect = padRect(...rect, 0.005);
      this.tooltip = new LabelTooltip(rect, {
        innerLabel: tooltip,
        scale: tooltipScale,
      });
    }
    else {
      this.tooltip = null;
    }
  }

  /**
   * Get persistent state object, used by gui elements to
   * store any properties they want to remember after being rebuilt.
   * @param {string} titleKey
   */
  getPState(titleKey) {
    const states = this.#persistentStates;
    if (!Object.hasOwn(states, titleKey)) {
      states[titleKey] = {};
    }
    return states[titleKey];
  }

  /**
   * Called in composite_gui_element.js
   * @param  {object} soundData The sound data object
   */
  registerSoundEffects(soundData) {
    if (!soundData) {
      return null;
    }

    return Object.fromEntries(
      Object.entries(soundData).map(
        ([name, data]) => [name, new SoundEffect(this, data)]
      )
    );
  }

  /**
   * Called in composite_gui_element.js
   * @param  {object} actors The named layout actor specs.
   */
  registerLayoutActors(actors) {
    if (!actors) {
      return null;
    }

    // prepare to return persistent GuiActor instances
    const result = {};

    // iterate over actor specs
    Object.entries(actors).forEach(([name, params]) => {
      if (!this.#layoutActors[name]) {

        // this is the first time this actor was registered
        this.#layoutActors[name] = new GuiActor(params);
      }

      // return existing GuiActor instance
      result[name] = this.#layoutActors[name];
    });

    return result;
  }

  /**
   *
   */
  get iconScale() {
    return ((this === global.mainScreen) ?
      1 : global.tutorialScaleFactor);
  }

  /**
   * Create a new Game Screen
   * @param {string} titleKey readable unique title to submit to ScreenManager
   * @param {number[]} rect
   * @param {ParticleSim} sim
   * @param {GameStateManager} gsm
   * @param {Macro} macro
   */
  constructor(titleKey, rect, sim, gsm, macro) {
    this.#titleKey = titleKey;
    this.#rect = rect;

    ScreenManager().submitNewScreen(this);

    // console.assert(gsm instanceof GameStateManager);
    // console.assert(sim instanceof ParticleSim);

    this.sim = sim;
    sim.screen = this;
    this.#stateManager = gsm;
    this.#soundManager = new SoundManager();
    this.#sounds = this.registerSoundEffects(SOUND_EFFECTS);

    const grabRad = global.rootScreen ? global.rootScreen.toolList[0].rad : global.mouseGrabRadius;
    this.toolList = [
      new DefaultTool(this, grabRad),
      new CircleTool(this),
      new LineTool(this),
      new BoxTool(this),

      // new EmitterTool(this),
      new PiTool(this, grabRad),
      new ExpTool(this),
    ];

    this.macro = macro;
    this.drawOffset = [0, 0];

    // modal gui elements
    this.tooltip = null;

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
    throw new Error('should use setTool()');
  }

  /**
   *
   */
  get contextMenu() {
    return this.#contextMenu;
  }

  /**
   * disallow assigning contextMenu with equals sign
   */
  set contextMenu(_c) {
    throw new Error('should use setContextMenu()');
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
   *
   */
  get soundManager() { return this.#soundManager; }

  /**
   *
   */
  get sounds() { return this.#sounds; }

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
   * @param {Gui} newGui The Gui instance to show on this screen
   */
  setGui(newGui) {
    const oldGui = this.gui;

    // check if old gui needs to be closed
    if (oldGui && !this._getVisibleGuis(newGui).has(oldGui._titleKey)) {
      // trigger closing sequence
      oldGui.close();
    }

    // switch to new gui
    this._gui = newGui;
    if (newGui) {
      newGui.setScreen(this);

      // check if new gui needs to be opened
      if (!this._getVisibleGuis(oldGui).has(newGui._titleKey)) {

        // trigger opening sequence
        newGui.open();
      }
    }
  }

  /**
   *
   * @param {Gui} rootGui
   */
  _getVisibleGuis(rootGui) {
    const vis = [];
    let gui = rootGui;
    while (gui) {
      vis.push(gui._titleKey);
      gui = gui.getBackgroundGui();
    }
    return new Set(vis);
  }

  /**
   *
   * @param {Vector} p mouse position
   */
  mouseMove(p) {
    this.mousePos = p;

    // reset idle countdown
    this.idleCountdown = this.idleDelay;

    // check if dragging gui element
    const dragging = this._getDraggingElem();
    if (dragging) {
      dragging.drag();
    }

    // trigger selected tool movement behavior
    const tool = this.tool;
    if (tool) { tool.mouseMove(p); }
  }

  /**
   *
   */
  _getDraggingElem() {
    if (!this.draggingElem) { return null; }

    // draggable elements can't be in the tooltip
    const searchIn = [this.gui, this.contextMenu];

    for (const composite of searchIn.filter(Boolean)) {
      const match = composite.findDescendant({ titleKey: this.draggingElem });
      if (match) { return match; }
    }
    return null;
  }

  /**
   * Called when mouse button is released
   */
  mouseUp() {

    // release any element that was being dragged
    this.draggingElem = null;

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
    const cm = this.#contextMenu;
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
      // console.log('clicked bg gui')
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
   * Set context menu gui element.
   * @param {?GuiElement} cm The new context menu.
   */
  setContextMenu(cm) {
    if (this !== global.mainScreen) {
      return;
    }
    this._resetActor('cmExpand');

    if (cm) {

      // start or switch to new different context menu
      cm.setScreen(this);

      if (this.#contextMenu) {

        // pass old menu's layout parameters to the new menu
        // and build
        cm._setLytParams(this.#contextMenu.lytParams);

      }
      else {

        // start collapsed and build
        cm._setLytParams({ expand: 0 });
      }
      this.#contextMenu = cm;

      // place test context menu on right side
      if (this.state !== GameStates.playing) {
        this._setActorTarget('cmSlide', 1);
      }

      // expand context menu
      this._setActorTarget('cmExpand', 1);
    }
    else {
      this.sim.selectedBody = null;
      this.sim.selectedParticle = null;

      // collapse context menu
      this._setActorTarget('cmExpand', 0);
    }
  }

  /**
   *
   * @param {string} name
   * @param {number} targetVal
   */
  _setActorTarget(name, targetVal) {
    const actor = this.#layoutActors[name];
    if (actor) { actor.setTarget(targetVal); }
  }

  /**
   *
   * @param {string} name
   */
  _resetActor(name) {
    const actor = this.#layoutActors[name];
    if (actor) { actor.resetGuiActor(); }
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
    const cm = this.#contextMenu;

    // point of interest to not cover with context menu
    let poi = null;

    // stop if game is paused
    if ((!this.stateManager) || (this.stateManager.state !== GameStates.pauseMenu)) {

      sim.update(dt);

      if (macro) {
        this._updateMacro(sim, macro, dt);
      }
    }

    // delete tooltip, knowing that any persistent
    // tooltip will be reinstated below
    this.tooltip = null;

    // update context menu
    // if (global.gameState !== GameStates.playing) {
    //   sim.selectedBody = null;
    // }
    if ((this === global.mainScreen) && (this.state === GameStates.playing)) {
      if (sim.selectedBody) {
        const bod = sim.selectedBody;
        poi = bod.pos;
        if (bod instanceof CompoundBody) {
          poi = bod.getMainBody().pos;
        }

        // check if new buddy or body context menu is warranted
        if (bod instanceof Buddy) {
          if ((!cm) || (cm._buddy !== bod)) {
            this.setContextMenu(bod.getContextMenu(this.rect));
          }
        }
        else if ((!cm) || (cm.body !== bod)) {
          this.setContextMenu(new BodyContextMenu(this.rect, { body: bod }));
        }

      }
      else if (sim.selectedParticle) {
        const p = sim.selectedParticle;
        const [_subgroup, _i, x, y, _dx, _dy, _hit] = p;
        poi = v(x, y);
        if ((!cm) || (!((cm instanceof PiContextMenu) && cm.pcmMatches(p)))) {
          this.setContextMenu(new PiContextMenu(this.rect, { sim: this.sim, pData: p }));
        }
      }
    }

    if (this.#contextMenu) {
      this._updateContextMenuAnim(poi);
    }

    let disableHover = false;
    const de = this._getDraggingElem();
    if (de) {
      disableHover = true;
      this.constructTooltipElement(de.tooltipFunc ? de.tooltipFunc() : de.tooltip, de.tooltipScale);
    }

    // update popups just in case they are persistent
    if (this.#contextMenu) {
      disableHover = disableHover || this.#contextMenu.update(dt, disableHover);
    }

    // update main gui
    if (gui) {
      disableHover = gui.update(dt, disableHover) || disableHover;

      // if applicable, update guis in background
      // e.g. hud behind upgrade menu
      if (this.stateManager.state !== GameStates.startTransition) {
        let bgGui = gui.getBackgroundGui();
        while (bgGui) {
          disableHover = bgGui.update(dt, disableHover);
          bgGui = bgGui.getBackgroundGui();
        }
      }
    }

    // trigger passive tool behavior
    const tool = this.tool;
    if (tool) { tool.update(dt); }

    // update popups just in case they are persistent
    if (this.tooltip) {
      this.tooltip.buildElements(this);
      this.tooltip.update(dt);
    }

    // update menu gui transition effect
    const menuGui = this.stateManager.getGuiForState(GameStates.upgradeMenu);
    if (menuGui) { menuGui.updateTransitionEffect(dt); } // upgrade_menu.js
  }

  /**
   * Called in update()
   * @param {Vector} poi The point of interest to avoid covering.
   */
  _updateContextMenuAnim(poi) {
    const cm = this.#contextMenu;

    // update context menu bounds animation
    const axis = (this.rect[2] > this.rect[3]) ? 0 : 1;
    this._setActorTarget('cmOrient', axis);

    // cm._updateLytParams();
    const lap = cm.lytParams;
    cm.setRect(this.rect);

    // cm.buildElements(this);

    const _cmSlideActor = this.#layoutActors.cmSlide;
    const _cmExpandActor = this.#layoutActors.cmExpand;

    // check if poi obstructed
    if ((_cmSlideActor.state === 0 || _cmSlideActor.state === 1) &&
      poi && (!cm.collapsed) && vInRect(poi, ...cm.bounds)) {

      // target farthest side next time
      _cmSlideActor.setTarget(1 - Math.round(lap.side));
    }

    // check if closing animation just finished
    if (lap.expand === 0 && _cmExpandActor.target === 0) {
      this.#contextMenu = null;
    }
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
      if (event[1] === 'tool') {
        this.setTool(this.getTool(event[2]));
      }
    });

    // like update.js
    // update control point hovering status
    sim.updateControlPointHovering(p);
  }

  /**
   * Find owned tool matching the given class.
   * @param {string|object} s The tool subclass/name to search for.
   * @returns {?Tool} The matching tool instance.
   */
  getTool(s) {
    let clazz = s;
    if (typeof s === 'string') {
      clazz = window[s];
    }
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
    let hideSim = false;
    if ((!global.gfxEnabled) && (this.stateManager.state !== GameStates.playing)) {
      hideSim = true;
    }

    // make sure the whole screen is cleared,
    // in case this is the main screen and we are
    // inside a box with dimensions
    // not matching the users's physical screen
    const clearRect = (this === global.mainScreen) ?
      global.rootScreen.rect : this.rect;
    g.clearRect(...clearRect);

    // draw screen
    this.sim.draw(g, hideSim);
    if (!hideGui) {
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
      this._drawBgGui(g, bgGui);
      bgGui.draw(g);
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

      // draw
      this._drawBgGui(g, gui);

      // draw current gui
      g.lineWidth = global.lineWidth;
      gui.draw(g);
    }

    if (gui && (!gui.blocksPopups)) {

      // draw extra elements
      const cm = this.#contextMenu;
      if (cm) {

        if (!cm._layout) {
          throw new Error('context menu has no layout');
        }

        cm.draw(g);
      }
      if (this.tooltip) {
        this.tooltip.draw(g);
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

