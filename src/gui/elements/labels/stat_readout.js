// a pixel art icon followed by a line of dynamic text
class StatReadout extends DynamicTextLabel {

  constructor(rect, icon, labelFunc) {
    super(rect, () => `  ${ labelFunc()}`);
    this.icon = icon;
    this.scale = this.constructor.scale();
    this.center = false;
  }

  static scale() { return 0.5; }

  // implement GuiElement
  draw(g) {
    super.draw(g);

    // draw icon
    const tps = global.textPixelSize;
    const xy = [this.rect[0] + this.pad, this.rect[1] + this.pad + this.scale * tps];

    if (!this.icon) { return; }
    const layout = this.isAnimated() ?
      this.icon.getCurrentAnimatedLayout() : this.icon.frames[0]; // icon.js

    drawLayout(g, xy[0], xy[1], layout, false, new FontSpec(this.pad, this.scale, true)); // character.js
    drawLayout(g, xy[0], xy[1], layout, false, new FontSpec(0, this.scale, false)); // character.js
  }

  isAnimated() {
    return true;
  }
}
