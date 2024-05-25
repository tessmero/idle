// base class for gui elements

// instances represent rectangles positioned on-screen
/**
 *
 */
class GuiElement {

  /**
   *
   * @param rect
   */
  constructor(rect) {
    this.rect = rect;
    this.hoverable = true;
    this._scale = 1;
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
  get scale() { return this._scale; }

  /**
   *
   * @param s
   */
  setScale(s) {
    this._scale = s;
  }

  /**
   *
   */
  getScale() {
    return this._scale;
  }

  /**
   *
   */
  set screen(_s) {
    throw new Error('should use setScreen');
  }

  // set root GameScreen instance
  /**
   *
   * @param s
   */
  setScreen(s) {
    this._screen = s;
  }

  // get root GameScreen instance
  /**
   *
   */
  get screen() {
    return this._screen;
  }

  /**
   *
   * @param s
   */
  withScale(s) {
    this.setScale(s);
    return this;
  }

  /**
   *
   * @param s
   */
  withTooltipScale(s) {
    this.tooltipScale = s;
    return this;
  }

  // set text to appear on hover
  /**
   *
   * @param s
   */
  withTooltip(s) {
    this.tooltip = s;
    return this;
  }

  /**
   *
   * @param f
   */
  withDynamicTooltip(f) {
    this.tooltipFunc = f;
    return this;
  }

  // override normal tooltip
  // until user stops hovering
  /**
   *
   * @param s
   */
  setTemporaryTooltip(s) {
    this.tempTooltip = s;
    this.tempTooltipEndTime = global.t + 1000; // millisecs
  }

  /**
   *
   * @param dt
   * @param disableHover
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
    if (!this.hovered || (global.t > this.tempTooltipEndTime)) { this.tempTooltip = null; }

    // check if a tooltip should be shown
    if (this.hovered && (this.tempTooltip || this.tooltipFunc || this.tooltip)) {
      if (this.tempTooltip) {
        this.tooltip = this.tempTooltip;
      }
      else if (this.tooltipFunc) {
        this.tooltip = this.tooltipFunc();
      }

      if (this.tooltip instanceof TooltipPopup) {
        if (this._screen) {
          this._screen.tooltipPopup = this.tooltip;
        }

      }
      else if ((typeof this.tooltip === 'string' || this.tooltip instanceof String)) {

        // build standard tooltip gui element
        let rect = LabelTooltipPopup.pickRect(screen, this.tooltip, this.tooltipScale);
        rect = padRect(...rect, TextLabel.pad());
        if (this._screen) {
          this._screen.tooltipPopup = new LabelTooltipPopup(rect, this.tooltip, this.tooltipScale);
        }
      }
    }

    return this.hovered;
  }

  /**
   *
   * @param _g
   */
  draw(_g) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  /**
   *
   */
  click() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
