// a button in the toolbar with a pixel art icon
class ToolbarButton extends CompositeGuiElement {

  constructor(rect, tool, indexInToolbar) {
    super(rect);

    this.tool = tool;
    this.indexInToolbar = indexInToolbar;

    const btn = new IconButton(rect, tool.icon, () => this.click());
    btn.isAnimated = (() => // override IconButton
      btn.hovered || (
        this.isSelected() &&
                (global.gameState === GameStates.playing)
      )
    );
    this.button = btn;
    this.children.push(btn);

    if (tool.getCost()) {
      let r = rect;
      const h = r[3] / 4;
      r = [r[0], r[1] + r[3] - h, r[2], h];
      r = padRect(...r, -0.004);
      const pi = new ProgressIndicator(r,
        () => global.mainSim.particlesCollected / tool.getCost())
        .withScale(0.2);
      this.children.push(pi);
    }

    // prepare to detect when an
    // unusable tool becomes usable
    this.wasUsable = this.tool.isUsable();
  }

  update(dt, disableHover) {

    // check if tool just became usable
    const usable = this.tool.isUsable();
    if ((!this.wasUsable) && (usable)) {

      // emmit particles
      const pps = global.mainSim.leftoverPPS;
      const mis = safeRandRange(1e-5, 2e-5);
      const mas = safeRandRange(1e-4, 2e-4);
      const center = v(...rectCenter(...this.rect));
      const ap = 1;
      for (let i = 0; i < 100; i++) {
        const v = vp(safeRandRange(-pio2 - ap, -pio2 + ap), randRange(mis, mas));
        v.y = v.y * 3;
        pps.spawnParticle(center, v);
      }

      // show message
      global.floaters.spawnFloater(center, 'available');

    }
    this.wasUsable = usable;

    // this.button.hoverable = this.tool.isUsable()
    return super.update(dt, disableHover);
  }

  isSelected() {
    return this.tool === global.mainSim.getTool();
  }

  click() {
    if (this.tool.isUsable()) {

      global.mainSim.setTool(this.tool);

      // close the upgrades menu if it is open
      if (global.gameState === GameStates.upgradeMenu) { toggleStats(); }

    }
    else {
      this.setTemporaryTooltip('collect more raindrops!');
    }

    return true;
  }

  draw(g) {
    super.draw(g);

    if (this.isSelected()) {

      // draw extra rectangle to highlight selected
      const outer = this.rect;
      const m = 0.005;
      const inner = [outer[0] + m, outer[1] + m, outer[2] - 2 * m, outer[3] - 2 * m];
      Button._draw(g, inner, false, false);
    }
  }
}
