/**
 * @file Tooltip base class.
 *
 * a rectangle that appears on top of all other elements
 */
class Tooltip extends CompositeGuiElement {

  /**
   * get rect using Tooltip.pickTooltipRect
   * @param {number[]} rect The rectangle to display on-screen.
   */
  constructor(rect) {
    super(rect);
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    const r = this.rect;

    // draw shadow
    const thick = global.tooltipShadowWidth;
    let x = r[0] - thick;
    let y = r[1] - thick;
    g.fillStyle = global.colorScheme.fg;
    g.fillRect(x, y, thick, r[3]);
    g.fillRect(x, y, r[2], thick);

    // draw white shadow of shadow
    const tt = global.lineWidth;
    x = x - tt;
    y = y - tt;
    g.clearRect(x, y, tt, r[3]);
    g.clearRect(x, y + r[3], r[2], tt);
    g.clearRect(x, y, r[2], tt);
    g.clearRect(x + r[2], y, tt, r[3]);

    // draw rectangle
    Button._draw(g, r);

    // draw children
    super.draw(g);
  }

  /**
   * implement GuiElement
   */
  click() {
    // do nothing
  }

  /**
   *
   * @param {GameScreen} screen
   */
  static pickMouseAnchorPoint(screen) {
    const sr = screen.rect;
    let p = screen.mousePos;
    if (!p) { p = v(0.5, 0.5); }
    const space = 0.05;
    const cursorSize = 0.05;

    if (p.y < (sr[1] + sr[3] / 2)) {

      // mouse is in top half of screen
      p = p.add(v(0, space + cursorSize));

    }
    else {

      // mouse is in bottom half of screen
      p = p.sub(v(0, space));

    }

    if (p.x < (sr[0] + sr[2] / 2)) {

      // mouse is in left half of screen
      p = p.add(v(space + cursorSize, 0));

    }
    else {

      // mouse is in right half of screen
      p = p.sub(v(space, 0));

    }

    return p;
  }

  /**
   * Pick a rectangle on-screen to position a new popup.
   * @param {Vector} anchorPoint The point near the mouse that must be touched by the tooltip.
   * @param {number} w The width needed for the tooltip content.
   * @param {number} h The height needed for the tooltip content.
   * @returns {number[]} The x,y,w,h for the popup.
   */
  static pickTooltipRect(anchorPoint, w, h) {
    const sr = global.mainScreen.rect;
    const ap = anchorPoint;

    // pick x position to just touch anchorPoint
    const midx = sr[0] + sr[2] / 2;
    let xr = (ap.x > midx) ? ap.x - w : ap.x;

    // pick y position to just touch anchorPoint
    const midy = sr[1] + sr[3] / 2;
    let yr = (ap.y > midy) ? ap.y - h : ap.y;

    // try to keep the whole rect is on screen
    if (xr < sr[0]) { xr = sr[0]; }
    if (yr < sr[1]) { yr = sr[1]; }
    if ((xr + w) > (sr[0] + sr[2])) { xr = (sr[0] + sr[2] - w); }
    if ((yr + h) > (sr[1] + sr[3])) { yr = (sr[1] + sr[3] - h); }

    return [xr, yr, w, h];
  }
}
