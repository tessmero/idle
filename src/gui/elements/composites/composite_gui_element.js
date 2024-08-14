/**
 * @file CompositeGuiElement
 * base class for elements that contain children elements
 */
class CompositeGuiElement extends GuiElement {

  /**
   * Optional reference to layout css in data folder
   * @abstract
   * @type {object}
   */
  _layoutData;

  /**
   * Layout rectangles' absolute x,y,w,h
   * Computed in computeLayoutRects()
   * @type {object}
   */
  _layout = null;

  /**
   * Rectangle to avoid drawing over even if opaque
   * @type {number[]}
   */
  #hole;

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
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const { opaque = false } = params;
    this.#opaque = opaque;
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
   * Get parameters for layout animation.
   * Used for when _layoutData is a list of layout objects with KEYFRAME properties.
   * @returns {object} The animation parameters matching or lying between keyframe parameters
   */
  _getLayoutAnimState() {
    return {};
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
    elems.forEach((e) => {
      if (e instanceof CompositeGuiElement) {
        e._parentCge = this; // used in _setHole()
      }
      if (e instanceof HoleElement) {
        this._setHole(e.rect);
      }
    });

    if (!elems.every(Boolean)) {
      throw new Error('falsey child element(s)');
    }

    this.#children = elems;
    this.setScreen(screen); // make sure screen is set for children

    elems.filter((e) => e instanceof CompositeGuiElement).forEach((e) => e.buildElements(screen));
  }

  /**
   * Compute css rectangles for direct children.
   * @param {GameScreen} screen The screen needed to pick icon scale.
   */
  _computeLayoutRects(screen) {
    const data = this._layoutData;
    if (!data) { return null; }
    let lr = this._layout;

    // get one representative if multiple layouts given
    const dataRep = data[0] ? data[0] : data;

    // check if not yet computed, or was computed in
    // superclass constructor and layout was extended
    if ((!lr) || (Object.keys(lr).length !== Object.keys(dataRep).length)) {

      // compute single layout
      lr = GuiLayoutParser.computeRects(
        this.rect, this._layoutData, screen.iconScale, this._getLayoutAnimState());

      this._layout = lr;
    }

    return lr;
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

    if (opaque && hole) {
      // fill around hole rectangle
      const border = new WindowBorder({ hole: padRect(...hole, -0.01) });
      g.globalCompositeOperation = 'destination-out';
      border.path(g, border.verts(this.rect));
      g.fill();
      g.globalCompositeOperation = 'source-over';
    }

    if (opaque || this.border) {
      Border.draw(g, this.rect, {
        fill: opaque && (!hole),
        border: this.border || new DefaultBorder(),
      });
    }

    this.#children.forEach((e) => e.draw(g));

    const layout = this._layout;

    if (global.debugUiRects && (!layout)) {

      // draw debug rectangle
      g.strokeStyle = 'red';
      g.lineWidth = global.lineWidth;
      g.strokeRect(...this.rect);
    }

    if (global.debugCssRects && layout) {
      g.strokeStyle = 'orange';
      g.lineWidth = global.lineWidth * 3;
      g.setLineDash([0.01, 0.01]);
      g.strokeRect(...this.rect);
      g.lineWidth = global.lineWidth;
      g.setLineDash([]);

      const color = 'green';
      g.strokeStyle = color;
      g.fillStyle = color;
      g.lineWidth = global.lineWidth;
      for (const [key, rectOrList] of Object.entries(layout)) {
        if (!key.startsWith('_')) {
          const rlist = ((typeof rectOrList[0] === 'number') ? [rectOrList] : rectOrList);
          rlist.forEach((rect) => {

            // const c = rectCenter(...rect);
            // drawText(g, ...c, key, true, new FontSpec(0, 0.3 * this.screen.iconScale, false));
            g.strokeRect(...rect);
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

    if (this.#opaque && vInRect(mousePos, ...this.rect)) {
      // console.log('clicked opaque composite element background');
      return true;
    }

    return false;
  }
}
