/**
 * @file base class for gui elements
 * instances represent rectangles positioned on-screen
 */
class GuiElement {

  #screen;
  #rect;
  #border;
  #scale; // font size

  // hoverable bool
  // tooltip string
  // tooltipFunc

  #tempTooltip;
  #tempTooltipEndTime;

  /**
   *
   * @param {number[]} rect The rectangle for this element.
   * @param {object} params The parameters.
   * @param {object} params.border
   * @param {boolean} params.hoverable
   * @param {number} params.scale
   * @param {string} params.tooltip
   * @param {Function} params.tooltipFunc
   */
  constructor(rect, params = {}) {
    console.assert((typeof rect[0] === 'number'));

    const {
      border = null, // new DefaultBorder(),
      hoverable = true,
      scale = 1,
      tooltipScale = LabelTooltip.defaultScale,
      tooltip = null,
      tooltipFunc = null,
    } = params;

    this.#rect = rect;
    this.#border = border;
    this.#scale = scale;
    this.tooltip = tooltip;
    this.tooltipScale = tooltipScale;
    this.tooltipFunc = tooltipFunc;
    this.hoverable = hoverable;
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
   * Temporarily override the normal tooltip text.
   * Reverts after the user stops hovering or some time passes.
   * @param {string} s The temporary tooltip text.
   */
  setTemporaryTooltip(s) {
    this.#tempTooltip = s;
    this.#tempTooltipEndTime = global.t + 1000; // millisecs
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
    this.hovered = mousePos ? (this.hoverable && vInRect(mousePos, ...this.rect)) : false;

    // reset temporary tooltip if necessary
    if (!this.hovered || (global.t > this.#tempTooltipEndTime)) { this.#tempTooltip = null; }

    // check if a tooltip should be shown
    if (this.hovered && (this.#tempTooltip || this.tooltipFunc || this.tooltip)) {
      if (screen) {
        screen.tooltip = this.constructTooltipElement();
      }
    }

    return this.hovered;
  }

  /**
   *
   */
  constructTooltipElement() {
    const screen = this.screen;

    if (this.#tempTooltip) {
      this.tooltip = this.#tempTooltip;
    }
    else if (this.tooltipFunc) {
      this.tooltip = this.tooltipFunc();
    }

    if (this.tooltip instanceof Tooltip) {
      if (screen) {
        return this.tooltip;
      }

    }
    else if ((typeof this.tooltip === 'string' || this.tooltip instanceof String)) {

      // build standard tooltip gui element
      let rect = this.pickTooltipRect(screen, this.tooltip, this.tooltipScale);
      rect = padRect(...rect, 0.005);
      return new LabelTooltip(rect, {
        label: this.tooltip,
        scale: this.tooltipScale,
      });
    }

    return null;
  }

  /**
   *
   * @param {GameScreen} screen
   */
  pickTooltipRect(screen) {
    return LabelTooltip.pickRect(screen, this.tooltip, this.tooltipScale);
  }

  /**
   *
   * @param {object} g The graphics context
   */
  draw(g) {
    if (this.border) {
      Border.draw(g, this.rect, {
        hovered: false,
        fill: false,
        border: this.border,
      });
    }
  }

  /**
   * If this element is opaque and under the mouse cursor,
   * execute any appropriate click action and return true.
   * Return false to indicate that the click event as not consumed by this element.
   */
  click() {
    return false;// throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
