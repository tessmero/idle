/**
 * @file base class for gui elements
 * instances represent rectangles positioned on-screen
 */
class GuiElement {

  #screen;
  #rect;
  #scale = 1;
  #border = null;

  #tempTooltip;
  #tempTooltipEndTime;

  /**
   *
   * @param {number[]} rect The rectangle for this element.
   */
  constructor(rect) {
    console.assert((typeof rect[0] === 'number'));

    this.#rect = rect;
    this.hoverable = true;
  }

  /**
   *
   */
  get rect() {
    return this.#rect;
  }

  /**
   *
   */
  set scale(s) {
    throw new Error('should use setScale');
  }

  /**
   *
   */
  get scale() { return this.#scale; }

  /**
   * Set font size for thie gui element.
   * @param {number} s The new font size.
   */
  setScale(s) {
    this.#scale = s;
  }

  /**
   * Set border style for this element.
   * @param {object} b The border instance.
   */
  setBorder(b) {
    this.#border = b;
  }

  /**
   * Chain-able helper to set border style.
   * @param {object} b The border instance.
   */
  withBorder(b) {
    this.setBorder(b);
    return this;
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
   * @param {number} s The new font size.
   */
  withScale(s) {
    this.setScale(s);
    return this;
  }

  /**
   * Chain-able helper to set tooltip fontsize.
   * @param {number} s The new font size.
   */
  withTooltipScale(s) {
    this.tooltipScale = s;
    return this;
  }

  /**
   * Chain-able helper to set text that appears when hovering.
   * @param {string} s The tooltip text to display.
   */
  withTooltip(s) {
    this.tooltip = s;
    return this;
  }

  /**
   * Chain-able helper to set callback to determine text to appear when hovering.
   * @param {Function} f The function who's return value will be displayed.
   */
  withDynamicTooltip(f) {
    this.tooltipFunc = f;
    return this;
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
   * @param {number} dt The time elapsed in millseconds.
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
      if (this.#tempTooltip) {
        this.tooltip = this.#tempTooltip;
      }
      else if (this.tooltipFunc) {
        this.tooltip = this.tooltipFunc();
      }

      if (this.tooltip instanceof Tooltip) {
        if (screen) {
          screen.tooltip = this.tooltip;
        }

      }
      else if ((typeof this.tooltip === 'string' || this.tooltip instanceof String)) {

        // build standard tooltip gui element
        let rect = this.pickTooltipRect(screen, this.tooltip, this.tooltipScale);
        rect = padRect(...rect, TextLabel.pad());
        if (screen) {
          screen.tooltip = new LabelTooltip(rect, this.tooltip, this.tooltipScale);
        }
      }
    }

    return this.hovered;
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
      Border._draw(g, this.rect, {
        hovered: false,
        fill: true,
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
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
