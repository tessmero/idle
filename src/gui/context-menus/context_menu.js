/**
 * @file ContextMenu gobal position/animation state
 * and base class for various context menu displays.
 */
let _lastContextMenuSide = -1;
let _lastContextMenuTime = -1;

/**
 * Context Menu modal gui element.
 * - takes up a large fraction of screen
 * - content divided into two square regions
 */
class ContextMenu extends CompositeGuiElement {

  /**
   * get params using ContextMenu.pickRects
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {number[]} square0 The first content square to align elements in.
   * @param {number[]} square1 The second content square to align elements in.
   */
  constructor(rect, square0, square1) {
    super(rect);

    this.square0 = square0;
    this.square1 = square1;
    this.withOpacity(true);
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    Button._draw(g, this.rect);
    super.draw(g);
  }

  /**
   * pick region for context menu
   * - within given rect
   * - leaving poit of interest visible
   *
   * return [bounding rect, innner square, inner square]
   * @param {number[]} rect The screen boundaries to align menu in.
   * @param {Vector} pointOfInterest The position on-screen that should be kept visible.
   */
  static pickRects(rect, pointOfInterest) {
    const pad = 0.05;
    const poi = pointOfInterest.xy();

    // pick top/bottom/left/right
    const axis = Number(rect[3] > rect[2]);
    let side = Number(poi[axis] < (rect[axis] + rect[axis + 2] / 2));

    // long axis of context menu
    const lax = rect[3 - axis];

    // size of content squares
    const ss = (lax - 3 * pad) / 2;

    // short axis of context menu
    const sax = ss + 2 * pad;

    // initally spawn context menu off screen
    if (true && (_lastContextMenuSide === -1)) {
      _lastContextMenuSide = 2 * (side - 0.5);
      _lastContextMenuTime = global.t;
    }

    // check if previously at diffent location
    if ((_lastContextMenuSide !== side) && (_lastContextMenuSide !== -1)) {

      const d = 0.1 + Math.abs(poi[axis] - (rect[axis] + 0.5 * rect[axis + 2]));
      const maxd = 0.5 * rect[axis + 2] - sax;
      if (d < maxd) {

        // leave context menu in non-ideal spot
        // since poi is not obstructed
        side = _lastContextMenuSide;

      }
      else {

        // poi is obstructed, so slide to target
        const targetSide = side;
        side = _lastContextMenuSide;
        const dt = global.t - _lastContextMenuTime;
        const ds = 1e-2 * dt;
        if (_lastContextMenuSide < targetSide) {
          side = Math.min(targetSide, side + ds);
        }
        else if (_lastContextMenuSide > targetSide) {
          side = Math.max(targetSide, side - ds);
        }
      }
    }
    _lastContextMenuSide = side;
    _lastContextMenuTime = global.t;

    // 20240602 working bandaid? for bug
    // where test context menu stops appearing
    if (side < 0) { side = 0; }
    if (side > 1) { side = 1; }

    if (axis) {

      // vertical screen
      const h = sax;
      const dy = side * (rect[3] - h);
      return [
        [rect[0], rect[1] + dy, rect[2], h],
        [rect[0] + pad, rect[1] + dy + pad, ss, ss],
        [rect[0] + pad + ss + pad, rect[1] + dy + pad, ss, ss],
      ];

    }

    // horizontal screen
    const w = sax;
    const dx = side * (rect[2] - w);
    return [
      [rect[0] + dx, rect[1], w, rect[3]],
      [rect[0] + pad + dx, rect[1] + pad, ss, ss],
      [rect[0] + pad + dx, rect[1] + pad + ss + pad, ss, ss],
    ];

  }
}
