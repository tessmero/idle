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
   *
   * @param c
   */
  addChild(c) {
    this.#children.push(c);
  }

  /**
   *
   * @param s
   */
  setScale(s) {
    super.setScale(s);
    this.#children.forEach((c) => c.setScale(s));
  }

  /**
   * set root GameScreen instance
   * @param s
   */
  setScreen(s) {
    super.setScreen(s);
    this.#children.forEach((c) => c.setScreen(s));
  }

  /**
   *
   * @param o
   */
  withOpacity(o) {
    this.#opaque = o;
    return this;
  }

  /**
   *
   * @param dt
   * @param disableHover
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
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    if (this.#opaque) { Button._draw(g, this.rect); }
    this.#children.forEach((e) => e.draw(g));
  }

  /**
   *
   */
  click() {
    const mousePos = this.screen.mousePos;
    if (!mousePos) { return false; }

    // check children in reverse order (last drawn = first clicked)
    if (this.#children.toReversed().some((e) => vInRect(mousePos, ...e.rect) &&
                e.click())) { return true; }

    if (this.#opaque && vInRect(mousePos, ...this.rect)) {
      console.log('clicked opaque composite element background');
      return true;
    }

    return false;
  }
}
