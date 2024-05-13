// base class for gui elements

// instances represent rectangles positioned on-screen
class GuiElement {

  constructor(rect) {
    this.rect = rect;
    this.hoverable = true;
    this.scale = 1;
  }

  // set root GameScreen instance
  setScreen(s) {
    this._screen = s;
  }

  // get root GameScreen instance
  getScreen() {
    return this._screen;
  }

  withScale(s) {
    this.scale = s;
    return this;
  }

  withTooltipScale(s) {
    this.tooltipScale = s;
    return this;
  }

  // set text to appear on hover
  withTooltip(s) {
    this.tooltip = s;
    return this;
  }

  withDynamicTooltip(f) {
    this.tooltipFunc = f;
    return this;
  }

  // override normal tooltip
  // until user stops hovering
  setTemporaryTooltip(s) {
    this.tempTooltip = s;
    this.tempTooltipEndTime = global.t + 1000; // millisecs
  }

  update(dt, disableHover = false) {
    if (disableHover) {
      this.hovered = false;
      return false;
    }

    // check if mouse is in this element's rectangle
    this.hovered = (this.hoverable && vInRect(global.mousePos, ...this.rect));

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
        let rect = LabelTooltipPopup.pickRect(this.tooltip, this.tooltipScale);
        rect = padRect(...rect, TextLabel.pad());
        if (this._screen) {
          this._screen.tooltipPopup = new LabelTooltipPopup(rect, this.tooltip, this.tooltipScale);
        }
      }
    }

    return this.hovered;
  }

  draw(_g) {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }

  click() {
    throw new Error(`Method not implemented in ${this.constructor.name}.`);
  }
}
