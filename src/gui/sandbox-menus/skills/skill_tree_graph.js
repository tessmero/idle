// draw the edges between skill cards in the skill tree gui
class SkillTreeGraph extends GuiElement {

  constructor(rect, tree) {
    super(rect);
    this.tree = tree;
  }

  draw(g) {
    if (!this.tree) { return; }

    g.beginPath();
    const specs = this.tree.state;
    for (const [_key, entry] of Object.entries(specs)) {
      if (entry.requires) {
        const pos = entry.pos;
        const rpos = specs[entry.requires].pos;
        g.moveTo(...pos);
        g.lineTo(...rpos);
      }
    }
    g.stroke();
  }

  click() {}
}
