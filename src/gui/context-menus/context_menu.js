/**
 * @file ContextMenu global sliding animation state
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
   * @param {object} params The parameters.
   */
  constructor(rect, params = {}) {
    super(rect, { opaque: true, ...params });
  }

  /**
   * pick region for context menu
   * - within given screen rectangle
   * - leaving poit of interest visible
   * @param {GameScreen[]} screen The screen to align menu in.
   * @param {?Vector} pointOfInterest The position on-screen that should be kept visible.
   */
  static pickRect(screen, pointOfInterest = null) {
    const rect = global.screenRect;// screen.rect;

    // load layout data depending on screen orientation
    const axis = Number(rect[3] > rect[2]);
    const css = axis ? VS_CONTEXT_MENU_BOUNDS : HS_CONTEXT_MENU_BOUNDS;
    const layout = GuiLayoutParser.computeRects(rect, css, screen.iconScale);

    if (!pointOfInterest) {

      // use bottom/right position
      return layout[1];
    }

    // pick target side (0 or 1) of the screen to avoid covering poi
    const poi = pointOfInterest.xy();
    let side = Number(poi[axis] < (rect[axis] + rect[axis + 2] / 2));

    // initally spawn context menu off screen
    if (true && (_lastContextMenuSide === -1)) {
      _lastContextMenuSide = 2 * (side - 0.5);
      _lastContextMenuTime = global.t;
    }

    // check if previously at different location
    if ((_lastContextMenuSide !== side) && (_lastContextMenuSide !== -1)) {

      // check if poi is obstructed
      const d = 0.1 + Math.abs(poi[axis] - (rect[axis] + 0.5 * rect[axis + 2])); // dist from screen center
      const sax = Math.min(layout[0][2], layout[0][3]);// short axis of context menu
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

    // compute precise bounding rect based on two extremes given in layout
    const result = ContextMenu._interpolate(layout[0], layout[1], side);
    return result;
  }

  /**
   * Compute animated bounding rectangle between two extremes.
   * @param {number[]} r0 The bounds at left/top extreme position.
   * @param {number[]} r1 The bounds at right/bottom extreme position.
   * @param {number} side The animation state in range [0,1]
   */
  static _interpolate(r0, r1, side) {
    const result = [];
    for (let i = 0; i < 4; i++) {
      result[i] = avg(r0[i], r1[i], side);
    }
    return result;
  }
}
