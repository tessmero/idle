/**
 * @file ContextMenu global sliding animation state
 * and base class for various context menu displays.
 */

// actor for sliding across screen
const _cmSlideActor = new GuiActor({

  // animate multiple parameters
  // data/gui-anims/context_menu_anim.js
  data: CONTEXT_MENU_ANIM,

  // speed of sliding anim including expand/collapse segments
  speed: 4e-3,

});

const _cmExpandActor = new GuiActor({

  // adjusts one layout  param
  param: 'expand',

  // speed of expand/collapse just to open or close
  speed: 1e-2,

});

const _cmOrientActor = new GuiActor({

  // adjust one layout param
  param: 'orientation',

  // speed of switching screen orientation
  speed: 1e-2,
});

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
   * pick region for context menu
   * - within given screen rectangle
   * - leaving poit of interest visible
   * @param {GameScreen[]} screen The screen to align menu in.
   * @param {?object} layoutAnimParams
   */
  static pickRect(screen, layoutAnimParams = null) {
    const rect = screen.rect;

    const lap = layoutAnimParams ? layoutAnimParams :
      ContextMenu.pickLayoutAnimParams();

    // return interpolated rectangle
    return GuiLayoutParser.computeRects(
      rect, CONTEXT_MENU_LAYOUT, screen.iconScale, lap
    ).bounds;
  }

  /**
   *
   */
  static pickLayoutAnimParams() {

    // smaller expand takes priority
    const slideParams = _cmSlideActor.update();
    const expandParams = _cmExpandActor.update();
    const expand = Math.min(slideParams.expand, expandParams.expand);

    return {
      ...this.layoutAnimParams,
      ..._cmOrientActor.update(),
      ...slideParams,
      ...expandParams,
      expand,
    };
  }
}
