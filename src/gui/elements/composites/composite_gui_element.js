/**
 * @file CompositeGuiElement
 * base class for elements that contain children elements
 */
class CompositeGuiElement extends GuiElement {

  /**
   * Layout css object in data/gui-layouts
   * @abstract
   * @type {object}
   */
  _layoutData;

  /**
   * named actor specs for animating layout
   * may reference objects in data/gui-anims
   * @abstract
   * @type {object}
   */
  _layoutActors;

  /**
   * sound data object in data/gui-sounds
   * @abstract
   * @type {object}
   */
  _soundData;

  /**
   * Layout rectangles' absolute x,y,w,h
   * Computed in computeLayoutRects()
   * @type {object}
   */
  _layout;

  /**
   * handles for persistent GuiActor instances
   * assigned in game_screen.js.
   * @type {object}
   */
  _actors;

  /**
   * handles for registered SoundEffect instances
   * assigned in game_screen.js.
   * @type {object}
   */
  _sounds;

  /**
   * Rectangle to avoid drawing over even if opaque
   * @type {number[]}
   */
  #hole;

  #lytParams;
  #children = [];
  #opaque;

  /**
   * Construct a new empty composite element with the given rectangle.
   *
   * The rectangle may not be displayed but still should roughly
   * enclose all the children that will be added.
   *
   * For opaque composites, the rectangle is
   * visible and may absorb mouse clicks.
   * @param {number[]} rect The rectangle for this composite.
   * @param {object} params The parameters.
   * @param {string} params.opaque true if this should have a solid background
   * @param {object} params.lytParams The object with values for @parameters in layout data
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const {
      opaque = false,
      lytParams = {},
    } = params;

    this.#opaque = opaque;
    this.#lytParams = lytParams;
  }

  /**
   * Override gui element if 'bounds' ruleset exists in layout.
   */
  get bounds() {
    const lyt = this._layout;
    return (lyt && lyt.bounds) ? lyt.bounds : this.rect;
  }

  /**
   *
   * @param {object} params The parameters (only titleKey supported)
   * @param {string} params.titleKey The desired titleKey to find
   */
  findDescendant(params) {
    const { titleKey } = params;
    for (const child of this.#children) {
      if (child.titleKey === titleKey) {
        return child; // matching direct child
      }
      if (child instanceof CompositeGuiElement) {
        const result = child.findDescendant(params);
        if (result) {
          return result; // matching descendant
        }
      }
    }
    return null; // no matching descendant
  }

  /**
   * Construct direct children for this composite.
   * @abstract
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    return [];// throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   * Update any actors and let them adjust layout parameters.
   */
  _updateLytParams() {

    // update actors and get new layout parameters
    let pars = this.lytParams;
    if (this._actors) {
      Object.values(this._actors).forEach((actor) => {
        pars = { ...pars, ...actor.update() };
      });
    }

    // trigger sound effects, apply new layout params, rebuild
    this._setLytParams(pars);
  }

  /**
   * Play any appropriate sound effects, apply the given layout params, and rebuild children
   * @param {object} pars The new layout parameters to apply.
   */
  _setLytParams(pars) {
    const lastParams = this._pState ? this._pState.lytParams : null;

    if (lastParams) {
      const soundsToPlay = GuiSoundParser.getTriggeredSounds(this._soundData, lastParams, pars);
      const soundPoint = rectCenter(...this.bounds);
      soundsToPlay.forEach((soundName) => this._sounds[soundName].play(soundPoint));
    }

    this.#lytParams = pars;
    if (this._pState) { this._pState.lytParams = pars; }
    this._layout = null;
    this.buildElements(this.screen);
  }

  /**
   *
   */
  get lytParams() {
    return this.#lytParams;
  }

  /**
   *
   */
  set lytParams(_s) {
    throw new Error('should use setLytParams()');
  }

  /**
   * Called in buildElements after a HoleElement is constructed.
   * @param {number[]} rect
   */
  _setHole(rect) {
    this.#hole = rect;
    if (this._parentCge) {
      this._parentCge._setHole(rect);
    }
  }

  /**
   * Recursively compute layout rectangles and construct children.
   * Called in GameStateManager._rebuildGui()
   * @param {GameScreen} screen The screen used to pick icon scale and
   *                            set as screen property for descendants.
   */
  buildElements(screen) {
    this.setScreen(screen);
    this._computeLayoutRects(screen);

    const elems = this._buildElements();

    if (!elems.every(Boolean)) {
      throw new Error('falsey child element(s)');
    }

    elems.forEach((e) => {
      e._parentCge = this; // used in _setHole()
      if (e instanceof HoleElement) {
        this._setHole(e.rect);
      }
    });

    this.#children = elems;
    this.setScreen(screen); // make sure screen is set for children

    elems.filter((e) => e instanceof CompositeGuiElement).forEach((e) => {
      e.buildElements(screen);
    });

  }

  /**
   * Compute css rectangles for direct children.
   * @param {GameScreen} screen The screen needed to pick icon scale.
   */
  _computeLayoutRects(screen) {
    if (this._layoutData && (!this._layout)) {
      this._layout = GuiLayoutParser.computeRects(
        this.rect, this._layoutData, screen.iconScale, this.#lytParams);
    }
  }

  /**
   *
   */
  get children() { return this.#children; }

  /**
   * Prevent setting children with equals sign.
   */
  set children(_c) {
    throw new Error('not allowed');
  }

  /**
   *
   */
  _clearChildren() {
    this.#children = [];
  }

  /**
   * Add a child gui element to this composite.
   * @param {GuiElement} _c The new gui element to include.
   */
  addChild(_c) {
    throw new Error('not allowed');
  }

  /**
   * Add children gui elements to this composite.
   * @param {GuiElement[]} _cs The new elements to include.
   */
  addChildren(_cs) {
    throw new Error('not allowed');
  }

  /**
   * Chainable helper to add children.
   * @param {GuiElement[]} _cs The new elements to include.
   */
  withChildren(_cs) {
    throw new Error('not allowed');
  }

  /**
   * @param {number} _s The font size.
   */
  setScale(_s) {
    throw new Error('should use constructor');
  }

  /**
   * Set root GameScreen instance for this and
   * all descendant gui elements.
   * @param {GameScreen} s The screen containing this element.
   */
  setScreen(s) {
    super.setScreen(s);
    this.#children.forEach((c) => c.setScreen(s));
    this._actors = s.registerLayoutActors(this._layoutActors);
    this._sounds = s.registerSoundEffects(this._soundData);
  }

  /**
   * @param {boolean} _o The opacity flag.
   */
  withOpacity(_o) {
    throw new Error('should use constructor');
  }

  /**
   * Update this element and descendants.
   * @param {number} dt The time elapsed in millseconds.
   * @param {boolean} disableHover
   */
  update(dt, disableHover = false) {

    // animate and rebuild if necessary
    this._updateLytParams();

    // check if hovered
    let hovered = super.update(dt, disableHover);
    hovered = this.#opaque && hovered;
    this.#children.forEach((e) => {
      hovered = e.update(dt, disableHover) || hovered;
    });

    return hovered;
  }

  /**
   * Draw this element and descendants.
   * @param {object} g The graphics context.
   */
  draw(g) {
    const opaque = this.#opaque; // true if should be filled
    const hole = this.#hole; // region requested to show through anyways
    const rect = this.bounds;

    if (opaque || this.border) {
      Border.draw(g, rect, {
        fill: opaque,
        border: this.border || new DefaultBorder(),
        hole,
      });
    }

    this.#children.forEach((e) => e.draw(g));

    const layout = this._layout;

    if (global.debugUiRects && (!layout)) {

      // draw debug rectangle
      g.strokeStyle = 'red';
      g.lineWidth = global.lineWidth;
      g.strokeRect(...rect);
    }

    if (global.debugCssRects && layout) {
      g.strokeStyle = 'orange';
      g.lineWidth = global.lineWidth * 3;
      g.setLineDash([0.01, 0.01]);
      g.strokeRect(...rect);
      g.lineWidth = global.lineWidth;
      g.setLineDash([]);

      const color = 'green';
      g.strokeStyle = color;
      g.fillStyle = color;
      g.lineWidth = global.lineWidth;
      for (const [key, rectOrList] of Object.entries(layout)) {
        if (!key.startsWith('_')) {
          const rlist = ((typeof rectOrList[0] === 'number') ? [rectOrList] : rectOrList);
          rlist.forEach((rr) => {

            // const c = rectCenter(...rect);
            // drawText(g, ...c, key, true, new FontSpec(0, 0.3 * this.screen.iconScale, false));
            g.strokeRect(...rr);
          });
        }
      }
      g.fillStyle = global.colorScheme.fg;
    }
  }

  /**
   * Execute the clicking action for the front-most
   * opaque descendant element under the mouse cursor.
   *
   * Return false if click passed through a transparent
   * point in this gui layer.
   * @returns {boolean} True if the click was absorbed.
   */
  click() {
    const mousePos = this.screen.mousePos;
    if (!mousePos) { return false; }

    // check children in reverse order (last drawn = first clicked)
    if (this.#children.toReversed().some((e) => vInRect(mousePos, ...e.rect) &&
                e.click())) { return true; }

    if (this.#opaque && vInRect(mousePos, ...this.bounds)) {
      // console.log('clicked opaque composite element background');
      return true;
    }

    return false;
  }
}
