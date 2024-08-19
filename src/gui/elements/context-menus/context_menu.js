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
  lytParam: 'expand',

  // speed of expand/collapse just to open or close
  speed: 1e-2,

});

const _cmOrientActor = new GuiActor({

  // adjust one layout param
  lytParam: 'orientation',

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
   * @param {number[]} rect The layout alignment rectangle (whole screen)
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
    if (this.collapsed) {

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
   * return true if this context menu is too collapsed to display children.
   */
  get collapsed() {
    const prm = this.lytParams;
    return prm && (prm.expand < this._minExpandToBuildElements);
  }

  /**
   *
   */
  static pickLayoutParams() {

    const orientParams = _cmOrientActor.update();

    // smaller expand takes priority
    const slideParams = _cmSlideActor.update();
    const expandParams = _cmExpandActor.update();
    const expand = Math.min(slideParams.expand, expandParams.expand);

    const final = {
      ...this.layoutAnimParams,
      ...orientParams,
      ...slideParams,
      ...expandParams,
      expand,
    };

    return final;
  }
}
