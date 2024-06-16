/**
 * @file CompositeGuiElement
 * base class for elements that contain children elements
 */
class CompositeGuiElement extends GuiElement {

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
   *
   */
  get children() { return this.#children; }

  /**
   * Prevent setting children with equals sign.
   */
  set children(_c) { throw new Error('should use setChildren'); }

  /**
   * Replace children with the given list.
   * @param {GuiElement[]} c The new list of children this composite should contain.
   */
  setChildren(c) { this.#children = c; }

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
    if (this.#opaque) { Button._draw(g, this.rect); }
    this.#children.forEach((e) => e.draw(g));
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
