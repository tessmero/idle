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

  #children = [];
  #opaque = false;

  /**
   * Construct a new empty composite element with the given rectangle.
   *
   * The rectangle may not be displayed but still should roughly
   * enclose all the children that will be added.
   *
   * For opaque composites, the rectangle is
   * visible and may absorb mouse clicks.
   * @param {number[]} rect The rectangle for this composite.
   */
  constructor(rect) {
    super(rect);
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
   * Recursively compute layout rectangles and construct children.
   * Called in GameStateManager._rebuildGui()
   * @param {GameScreen} screen The screen used to pick icon scale and
   *                            set as screen property for descendants.
   */
  buildElements(screen) {
    this.setScreen(screen);
    this._computeLayoutRects(screen);

    const elems = this._buildElements();
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

    // check if not yet computed, or was computed in
    // superclass constructor and layout was extended
    if ((!lr) || (Object.keys(lr).length !== Object.keys(data).length)) {
      lr = GuiLayoutParser.computeRects(this.rect, this._layoutData, screen.iconScale);
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
  set children(_c) { throw new Error('should use setChildren'); }

  /**
   * Add a child gui element to this composite.
   * @param {GuiElement} c The new gui element to include.
   */
  addChild(c) {
    this.#children.push(c);
  }

  /**
   * Add children gui elements to this composite.
   * @param {GuiElement[]} cs The new elements to include.
   */
  addChildren(cs) {
    cs.forEach((c) => this.addChild(c));
  }

  /**
   * Chainable helper to add children.
   * @param {GuiElement[]} cs The new elements to include.
   */
  withChildren(cs) {
    this.addChildren(cs);
    return this;
  }

  /**
   * Set the font size for this element and descendants.
   * @param {number} s The font size.
   */
  setScale(s) {
    super.setScale(s);
    this.#children.forEach((c) => c.setScale(s));
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
   * Chainable helper to set opacity.
   * If opaque is set to true, this element's rectangle will
   * be filled, may cover sims or guis, and will absorb clicks.
   * @param {boolean} o The opacity flag.
   */
  withOpacity(o) {
    this.#opaque = o;
    return this;
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
    if (this.#opaque || this.border) {
      Border._draw(g, this.rect, { fill: this.#opaque, border: this.border });
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
