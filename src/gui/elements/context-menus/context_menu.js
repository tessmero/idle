/**
 * @file ContextMenu gui element
 * - takes up a large fraction of screen
 * - content divided into two square regions
 * - built in game_screen.js
 */
class ContextMenu extends CompositeGuiElement {
  _titleKey = 'context-menu';
  _layoutData = CONTEXT_MENU_LAYOUT;
  _soundData = CONTEXT_MENU_SOUNDS;
  _layoutActors = {

    // sliding animation including expand/collapse segments
    cmSlide: {
      lytAnim: CONTEXT_MENU_ANIM,
      speed: 4e-3,
    },

    // expand/collapse just to open or close
    cmExpand: {
      lytParam: 'expand',
      speed: 1e-2,
    },

    // switching screen orientation
    cmOrient: {
      lytParam: 'orientation',
      speed: 1e-2,
    },
  };

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
      this._computeLayoutRects(screen);

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
   * Override composite_gui_element to add special handling for
   * two actors both adjusting 'expand' layout parameter.
   */
  _updateLytParams() {
    const actors = this._actors;

    const orientParams = actors.cmOrient.update();

    // smaller expand takes priority
    const slideParams = actors.cmSlide.update();
    const expandParams = actors.cmExpand.update();
    const expand = Math.min(slideParams.expand, expandParams.expand);

    const final = {
      ...this.lytParams,
      ...orientParams,
      ...slideParams,
      ...expandParams,
      expand,
    };

    this._setLytParams(final);
  }
}
