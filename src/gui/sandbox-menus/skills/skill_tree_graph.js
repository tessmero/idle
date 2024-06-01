/**
 * @file SkillTreeGraph gui element
 * Used to draw the lines connecting skills in the tree
 * Drawn behind other elements in the skills tab
 */
class SkillTreeGraph extends GuiElement {

  /**
   *
   * @param rect
   * @param tree
   */
  constructor(rect, tree) {
    super(rect);
    this.tree = tree;
  }

  /**
   *
   * @param g
   */
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

  /**
   *
   */
  click() {}
}
