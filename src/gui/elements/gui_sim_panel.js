// container that displays a particle simulation
//
class GuiSimPanel extends GuiElement {
  constructor(rect, sim) {
    super(rect);
    this.sim = sim;
    const r = this.rect;
    sim.drawOffset = [r[0] - sim.rect[0], r[1] - sim.rect[1]];
    this.paused = false;
    this.loop = true;
  }

  reset() {
    this.sim.reset();
    const tut = this.tut;
    if (tut) {
      tut.t = 0;
      tut.finished = false;
    }
  }

  update(dt, disableHover) {
    const hovered = super.update(dt, disableHover);

    if (this.paused) { return hovered; }

    this.sim.update(dt);

    const tut = this.tut;
    if (tut) {

      if (tut.finished) {
        if (this.loop) {
          this.reset();
        }
        else {
          return hovered;
        }
      }

      const tool = tut.tool;
      tool.sim = this.sim;
      this.sim.setTool(tool);
      tool.update(dt);
      const keyframes = tut.update(dt);
      let p = tut.getCursorPos().xy();
      const sr = this.sim.rect;
      p = v(p[0] * sr[2], p[1] * sr[3]);

      // emulate user input if necessary
      // (tutorial.js)
      keyframes.forEach((event) => {
        if (event[1] === 'down') { tool.mouseDown(p); }
        if (event[1] === 'up') { tool.mouseUp(p); }
        if (event[1] === 'primaryTool') { tut.tool = tut.primaryTool; }
        if (event[1] === 'defaultTool') { tut.tool = tut.defaultTool; }
      });

      // like update.js
      // update control point hovering status
      this.sim.updateControlPointHovering(p);
    }

    return hovered;
  }

  draw(g) {

    g.clearRect(...this.rect);

    this.sim.draw(g);

    // trim sides
    const [rx, ry, rw, rh] = this.rect;
    const m = rw * 0.1;
    const h = rh + 0.002;
    const y = ry - 0.001;
    g.clearRect(rx - m, y, m, h);
    g.clearRect(rx + rw, y, m, h);
    g.strokeStyle = global.colorScheme.fg;
    g.lineWidth = global.lineWidth;
    g.strokeRect(...this.rect);

    if (this.tut) {

      // draw cursor like in draw.js
      const tut = this.tut;
      const tool = tut.tool;
      tool.sim = this.sim;
      let p = tut.getCursorPos().xy();
      const sr = this.sim.rect;
      p = [p[0] * sr[2], p[1] * sr[3]];
      if (tut.lastCursorPos) {
        const lp = tut.lastCursorPos;
        if ((p[0] !== lp[0]) || (p[1] !== lp[1])) {
          tool.mouseMove(v(...p));
        }
      }
      else {
        tut.lastCursorPos = p;
      }

      // pos in sim -> real screen pos
      const off = this.sim.drawOffset;
      p = [p[0] + off[0], p[1] + off[1]];
      tool.drawCursor(g, p, global.tutorialToolScale, false);

      // draw tool overlay if applicable
      if (tool.draw) {
        g.translate(...off);
        tool.draw(g);
        g.translate(-off[0], -off[1]);
      }
    }
  }

  click() {}
}
