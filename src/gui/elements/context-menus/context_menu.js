/**
 * @file ContextMenu global sliding animation state
 * and base class for various context menu displays.
 */
const _cmSideState = {
  side: 1, // animation state [0,1]
  lastTime: -1, // system time of last update
};

const _cmExpandState = {
  expand: 0,
  targetExpand: 1, // 0 or 1
  lastTime: -1, // system time of last update
};

/**
 * Context Menu modal gui element.
 * - takes up a large fraction of screen
 * - content divided into two square regions
 */
class ContextMenu extends CompositeGuiElement {
  _layoutData = CONTEXT_MENU_LAYOUT;

  /**
   * Set threshold to decide if this menu is too collapsed
   * to build and display child elements
   * @type {number} 0-1
   */
  _minExpandToBuildElements = 0.2;

  // speed of sliding anim including expand/collapse segments
  // data/gui-anims/context_menu_anim.js
  static _slideSpeed = 4e-3;

  // speed of expand/collapse just to open or close
  static _openCloseSpeed = 1e-2;

  /**
   * get params using ContextMenu.pickRects
   * @param {number[]} rect The rectangle enclosing the whole menu.
   * @param {object} params The parameters.
   */
  constructor(rect, params = {}) {
    super(rect, {
      border: new CardBorder(),
      opaque: true,
      ...params,
    });
  }

  /**
   * Override CompositeGuiElement,
   * skip inner layout parsing and element construction
   * if outer bounds are too collapsed.
   * @param  {GameScreen} screen
   */
  buildElements(screen) {

    // check if collapsed
    const current = this.layoutAnimState;
    if (current && (current.expand < this._minExpandToBuildElements)) {

      // emulate building empty list of elements
      this._clearChildren(screen);
      this.setScreen(screen);

    }
    else {

      // behave like normal CompositeGuiElement
      super.buildElements(screen);
    }
  }

  /**
   *
   * @param {GameScreen} screen
   * @param {?Vector} pointOfInterest
   */
  static pickLayoutAnimParams(screen, pointOfInterest = null) {
    const rect = screen.rect;
    const axis = Number(global.verticalDisplay);

    let side = _cmSideState.side;
    let expand = _cmExpandState.expand;

    // check if correctly expanded/collapsed
    if (_cmExpandState.expand === _cmExpandState.targetExpand) {

      // animate sliding if necessary
      side = ContextMenu._getAnimatedSide(rect, axis, pointOfInterest);

      // return animation params
      const animParams = GuiAnimParser.computeLayoutAnimParams(CONTEXT_MENU_ANIM, side);
      return {
        orientation: axis,
        ...animParams,
      };

    }
    else if (_cmExpandState.lastTime === -1) {
      _cmExpandState.lastTime = global.t;
    }
    else {

      // animate expanding or collapsing
      const dt = global.t - _cmExpandState.lastTime;
      const target = _cmExpandState.targetExpand;
      const de = ContextMenu._openCloseSpeed * dt;

      if (expand < target) {
        expand = Math.min(target, expand + de);
      }
      else if (expand > target) {
        expand = Math.max(target, expand - de);
      }

      if (expand < 0) { expand = 0; }
      if (expand > 1) { expand = 1; }
      _cmExpandState.expand = expand;
      _cmExpandState.lastTime = global.t;
    }

    // 20240602 bandaid for when test context menu stops appearing
    if (side < 0) { side = 0; }
    if (side > 1) { side = 1; }

    // return animation params
    return {
      orientation: axis,
      expand,
      side,
    };
  }

  /**
   * pick region for context menu
   * - within given screen rectangle
   * - leaving poit of interest visible
   * @param {GameScreen[]} screen The screen to align menu in.
   * @param {?Vector} pointOfInterest The position on-screen that should be kept visible.
   * @param {?object} layoutAnimParams
   */
  static pickRect(screen, pointOfInterest = null, layoutAnimParams = null) {
    const rect = screen.rect;

    const lap = layoutAnimParams ? layoutAnimParams :
      ContextMenu.pickLayoutAnimParams(screen, pointOfInterest);

    // return interpolated rectangle
    return GuiLayoutParser.computeRects(
      rect, CONTEXT_MENU_LAYOUT, screen.iconScale, lap
    ).bounds;
  }

  /**
   *
   * @param {number[]} rect
   * @param {number} axis
   * @param {Vector} pointOfInterest
   */
  static _getAnimatedSide(rect, axis, pointOfInterest) {
    const poi = pointOfInterest ? pointOfInterest.xy() : [0, 0];

    // use bottom/right position by default
    let { side = 1 } = _cmSideState;

    if (pointOfInterest) {

      // pick target side (0 or 1) of the screen to avoid covering poi
      side = Number(poi[axis] < (rect[axis] + rect[axis + 2] / 2));
    }

    // initially spawn context menu
    if (_cmSideState.side === -1) {
      _cmSideState.side = 2 * (side - 0.5);
      _cmSideState.sideTime = global.t;
    }

    // check if previously at different location
    if ((_cmSideState.side !== side) && (_cmSideState.side !== -1)) {

      // check if poi is obstructed
      const d = 0.1 + Math.abs(poi[axis] - (rect[axis] + 0.5 * rect[axis + 2])); // dist from screen center
      const sax = 0.4; // Math.min(layout[0][2], layout[0][3]);// short axis of context menu
      const maxd = 0.5 * rect[axis + 2] - sax;
      if (d < maxd) {

        // leave context menu in non-ideal spot
        // since poi is not obstructed
        side = Math.round(_cmSideState.side);

      }
      else {

        // poi is obstructed, so slide to target
        const targetSide = side;
        side = _cmSideState.side;
        const dt = global.t - _cmSideState.lastTime;
        const ds = ContextMenu._slideSpeed * dt;
        if (_cmSideState.side < targetSide) {
          side = Math.min(targetSide, side + ds);
        }
        else if (_cmSideState.side > targetSide) {
          side = Math.max(targetSide, side - ds);
        }
      }
    }
    _cmSideState.side = side;
    _cmSideState.lastTime = global.t;

    return side;
  }

  /**
   * Compute animated bounding rectangle between two extremes.
   * @param {number[]} r0 The bounds at extreme position 0.
   * @param {number[]} r1 The bounds at extreme position 1.
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
