// base class for gui elements that contain "children" gui elements
/**
 *
 */
class CompositeGuiElement extends GuiElement {

  /**
   *
   * @param rect
   */
  constructor(rect) {
    super(rect);
    this.children = [];
    this.opaque = false;
  }

  /**
   *
   * @param s
   */
  setScale(s) {
    super.setScale(s);
    this.children.forEach((c) => c.setScale(s));
  }

  // set root GameScreen instance
  /**
   *
   * @param s
   */
  setScreen(s) {
    super.setScreen(s);
    this.children.forEach((c) => c.setScreen(s));
  }

  /**
   *
   * @param o
   */
  withOpacity(o) {
    this.opaque = o;
    return this;
  }

  /**
   *
   * @param dt
   * @param disableHover
   */
  update(dt, disableHover = false) {
    let hovered = super.update(dt, disableHover);
    hovered = this.opaque && hovered;
    this.children.forEach((e) => {
      hovered = e.update(dt, disableHover) || hovered;
    });
    return hovered;
  }

  /**
   *
   * @param g
   */
  draw(g) {
    if (this.opaque) { Button._draw(g, this.rect); }
    this.children.forEach((e) => e.draw(g));
  }

  /**
   *
   */
  click() {
    const mousePos = this.screen.mousePos;
    if (!mousePos) { return false; }

    if (this.children.some((e) => vInRect(mousePos, ...e.rect) &&
                e.click())) { return true; }

    if (this.opaque && vInRect(mousePos, ...this.rect)) {
      // console.log( 'clicked opaque composite elemnt background' )
      return true;
    }

    return false;
  }
}
