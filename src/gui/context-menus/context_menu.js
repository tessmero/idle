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
  _layoutData = CONTEXT_MENU_LAYOUT;

  /**
   * get params using ContextMenu.pickRects
   * @param {number[]} rect The rectangle enclosing the whole menu.
   */
  constructor(rect) {
    super(rect);
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
   * - within given screen rectangle
   * - leaving poit of interest visible
   * @param {GameScreen[]} screen The screen to align menu in.
   * @param {?Vector} pointOfInterest The position on-screen that should be kept visible.
   */
  static pickRect(screen, pointOfInterest = v(0, 0)) {
    const rect = screen.gui ? screen.gui.getScreenEdgesForContextMenu() : screen.rect;
    const poi = pointOfInterest.xy();

    // pick top/bottom/left/right
    const axis = Number(rect[3] > rect[2]);
    let side = Number(poi[axis] < (rect[axis] + rect[axis + 2] / 2));

    // length of shorter axis (width or height) of resulting rect
    const sax = CONTEXT_MENU_SHORT_AXIS;

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
      return [rect[0], rect[1] + dy, rect[2], h];

    }

    // horizontal screen
    const w = sax;
    const dx = side * (rect[2] - w);
    return [rect[0] + dx, rect[1], w, rect[3]];

  }
}
