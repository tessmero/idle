/**
 * @file base class for gui elements
 * instances represent rectangles positioned on-screen
 */
class GuiElement {
  _titleKey; // unique key necessary if _pState is used
  _pState; // persistent state object

  #screen;
  #rect;
  #border;
  #fill;

  #label; // optional display text
  #labelFunc;
  #autoAdjustRect;
  #icon; // optional display icon

  #scale; // font size
  #textAlign; // 'left' or 'center'
  #style; // text style like 'hud'
  #pad;
  #letterPixelPad;

  // hoverable bool
  // tooltip string
  // tooltipFunc

  /**
   *
   * @param {number[]} rect The rectangle for this element.
   * @param {object} params The parameters.
   * @param {string} params.titleKey readable unique key used to store persistent state in GameScreen
   * @param {object} params.border The optional Border style instance
   * @param {boolean} params.fill True if the inside of the border should be filled.
   * @param {string} params.tooltip The tooltip text
   * @param {Function} params.tooltipFunc The function returning tooltip text
   * @param {Icon} params.icon the icon to display.
   * @param {string} params.label the text to display.
   * @param {string} params.labelFunc The function to get text to display.
   * @param {string} params.text Should use label instead. unpacked to throw error message.
   * @param {string} params.style Special style flag like 'hud'
   * @param {number} params.pad Padding around outside of text.
   * @param {number} params.letterPixelPad Padding around each character pixel.
   * @param {string} params.center Should use textAlign instead. unpacked to throw error message.
   * @param {string} params.textAlign 'center' or 'left'
   * @param {number} params.scale font size for label and size of icon
   * @param {number} params.tooltipScale font size for tooltip
   * @param {boolean} params.hoverable
   * @param {boolean} params.autoAdjustRect True to enable automatic resize.
   *                                        Used to make HUD displays precisely
   *                                        hoverable as their values change.
   */
  constructor(rect, params = {}) {
    const {
      titleKey, // optional titlekey for _pState

      icon,
      label,
      labelFunc,
      autoAdjustRect,
      textAlign = 'center',
      style = null,
      pad = 0.005,
      letterPixelPad = 0.005,
      border = null, // new DefaultBorder(),
      fill = false,
      hoverable = true,
      scale = 1,
      tooltipScale = LabelTooltip.defaultScale,
      tooltip = null,
      tooltipFunc = null,

      text, // should not be set
      center, // should not be set

    } = params;

    if (text) {
      throw new Error('invalid parameter \'text\'. should use \'label\'');
    }

    if (center) {
      throw new Error('invalid parameter \'center\'. should use \'textAlign\'');
    }

    this._titleKey = titleKey;

    this.#icon = icon;
    this.#label = label;
    this.#pad = pad;
    this.#letterPixelPad = letterPixelPad;
    this.#style = style;
    this.#labelFunc = labelFunc;
    this.#autoAdjustRect = autoAdjustRect;
    this.#textAlign = textAlign;
    this.#scale = scale;

    this.#rect = rect;
    this.#border = border;
    this.#fill = fill;
    this.tooltip = tooltip;
    this.tooltipScale = tooltipScale;
    this.tooltipFunc = tooltipFunc;
    this.hoverable = hoverable;
  }

  /**
   *
   */
  get titleKey() { return this._titleKey; }

  /**
   * Called in dynamic_text_label and test_context_menu
   * @param {string} l The new label.
   */
  setLabel(l) {
    this.#label = l;
  }

  /**
   *
   */
  get label() {
    return this.#label;
  }

  /**
   * Public getter.
   */
  get rect() {
    return this.#rect;
  }

  /**
   * Rectangle that may be overridden by CompositeGuiElement for convenient 'bounds' in layout data.
   */
  get bounds() {
    return this.#rect;
  }

  /**
   *
   * @param {number[]} r
   */
  setRect(r) {
    this.#rect = r;
  }

  /**
   *
   */
  set icon(icn) {
    this.#icon = icn;
  }

  /**
   *
   */
  set scale(_s) {
    throw new Error('should use constructor');
  }

  /**
   *
   */
  get scale() { return this.#scale; }

  /**
   * Set font size for thie gui element.
   * @param {number} _s The new font size.
   */
  setScale(_s) {
    throw new Error('should use constructor');
  }

  /**
   * Set border style for this element.
   * @param {object} _b The border instance.
   */
  setBorder(_b) {
    throw new Error('should use constructor');
  }

  /**
   * Chain-able helper to set border style.
   * @param {object} _b The border instance.
   */
  withBorder(_b) {
    throw new Error('should use constructor');
  }

  /**
   *
   */
  set border(_b) {
    throw new Error('should use setBorder');
  }

  /**
   *
   */
  get border() { return this.#border; }

  /**
   *
   */
  set screen(_s) {
    throw new Error('should use setScreen');
  }

  /**
   * set root GameScreen instance
   * @param {GameScreen} s
   */
  setScreen(s) {
    this.#screen = s;

    // get persistent state object
    if (this._titleKey) {
      this._pState = s.getPState(this._titleKey);
      this._pState.element = this;
    }
  }

  /**
   * get root GameScreen instance
   */
  get screen() {
    return this.#screen;
  }

  /**
   * Chain-able helper to set font size.
   * @param {number} _s The new font size.
   */
  withScale(_s) {
    throw new Error('should use constructor');
  }

  /**
   * Chain-able helper to set tooltip fontsize.
   * @param {number} _s The new font size.
   */
  withTooltipScale(_s) {
    throw new Error('should use constructor');
  }

  /**
   * Chain-able helper to set text
   * @param {string} _s The tooltip text to display.
   */
  withTooltip(_s) {
    throw new Error('should use constructor');
  }

  /**
   * Chain-able helper to set callback to determine text to appear when hovering.
   * @param {Function} _f The function who's return value will be displayed.
   */
  withDynamicTooltip(_f) {
    throw new Error('should use constructor');
  }

  /**
   *
   * @param {number} dt The time elapsed in milliseconds.
   * @param {boolean} disableHover The if mouse hovering should be disabled.
   */
  update(dt, disableHover = false) {
    if (disableHover) {
      this.hovered = false;
      return false;
    }

    const screen = this.screen;

    // check if mouse is in this element's rectangle
    const mousePos = screen.mousePos;
    this.hovered = mousePos ? (this.hoverable && vInRect(mousePos, ...this.bounds)) : false;

    // check if a tooltip should be shown
    if (this.hovered && (this.tooltipFunc || this.tooltip)) {
      if (screen) {

        const tooltip = this.tooltipFunc ? this.tooltipFunc() : this.tooltip;
        screen.constructTooltipElement(tooltip, this.tooltipScale);
      }
    }

    return this.hovered;
  }

  /**
   *
   * @param {object} g The graphics context
   */
  draw(g) {
    this._drawBorder(g);
    this._drawIconText(g);
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  _drawIconText(g) {

    this._updateLabel();

    if (this.#icon && this.#label) {
      this._drawAsStatReadout(g);
    }

    else if (this.#label) {
      this._drawAsTextLabel(g);
    }
    else if (this.#icon) {
      this._drawAsIconElement(g);
    }
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  _drawBorder(g) {

    if (this.border) {
      Border.draw(g, this.rect, {
        hovered: this.hovered,
        fill: this.#fill,
        border: this.#border,
      });
    }
  }

  /**
   * If labelFunc is set, call it and update label.
   */
  _updateLabel() {
    if (this.#labelFunc) {
      // get updated label
      const label = this.#labelFunc();
      this.setLabel(label);

      if (this.#autoAdjustRect) {
        // update bounding rectangle to fit label
        const [w, h] = getTextDims(label, this.#scale);
        this.rect[2] = w + this.#pad * 2;
        this.rect[3] = h + this.#pad * 2;
      }
    }
  }

  /**
   * execute any appropriate click action and return true.
   * Return false to indicate that the click event as not consumed by this element.
   */
  click() {
    return false;// throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   *
   * @param {object} g The graphics context
   * @param {string} label
   */
  _drawAsTextLabel(g, label = this.#label) {
    const rect = this.rect;
    const scale = this.#scale;

    const style = this.#style;
    const center = (this.#textAlign === 'center');
    const pad = this.#pad;

    let p;
    if (center) {
      p = rectCenter(...rect);
    }
    else {
      p = [rect[0] + pad, rect[1] + pad + scale * global.textPixelSize];
    }

    if (style === 'inverted') {

      // draw simple white text
      drawText(g, ...p, label, center, new FontSpec(0, scale, true));

    }
    else if (style === 'hud') {

      // draw extra readable for hud
      drawText(g, ...p, label, center, new FontSpec(this.#letterPixelPad, scale, true));
      drawText(g, ...p, label, center, new FontSpec(0, scale, false));

    }
    else if (style === 'tiny') {

      // should draw tiny 3x5 pixel font simple black text
      drawText(g, ...p, label, center, new FontSpec(0, scale, false));

    }
    else {

      // draw simple black text
      drawText(g, ...p, label, center, new FontSpec(0, scale, false));
    }
  }

  /**
   *
   * @param {object} g The graphics context
   */
  _drawAsIconElement(g) {

    // was IconElement
    const icon = this.#icon;
    const layout = this.isAnimated() ?
      icon.getCurrentAnimatedLayout() : icon.frames[0];
    drawLayout(g, ...rectCenter(...this.rect), layout, true, new FontSpec(0, this.scale));
  }

  /**
   * Stat readout icon is animated by default.
   * @returns {boolean} true to make the icon animated.
   */
  isAnimated() {
    return true;
  }

  /**
   *
   * @param {object} g The graphics context
   */
  _drawAsStatReadout(g) {
    const rect = this.rect;
    const pad = this.#pad;
    const scale = this.#scale;

    const icon = this.#icon;

    // draw icon
    const tps = global.textPixelSize;
    const xy = [rect[0] + pad, rect[1] + pad + scale * tps];

    if (!icon) { return; }
    const layout = this.isAnimated() ?
      icon.getCurrentAnimatedLayout() : icon.frames[0]; // icon.js

    drawLayout(g, xy[0], xy[1], layout, false, new FontSpec(pad, scale, true)); // character.js
    drawLayout(g, xy[0], xy[1], layout, false, new FontSpec(0, scale, false)); // character.js

    // draw label with extra space on left
    this._drawAsTextLabel(g, `   ${ this.#label}`);
  }
}
