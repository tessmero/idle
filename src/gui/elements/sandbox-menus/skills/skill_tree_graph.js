/**
 * @file SkillTreeGraph gui element
 * Used to draw the lines connecting skills in the tree
 * Drawn behind other elements in the skills tab
 */
class SkillTreeGraph extends GuiElement {

  #tree;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param  {object} params The parameters.
   * @param {object} params.tree The SkillTree instance, global.skillTree.
   * @param {object} params.entry The value in tree.state containing specs for one skill.
   */
  constructor(rect, params = {}) {
    super(rect, params);
    const { tree } = params;
    this.#tree = tree;
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    if (!this.#tree) { return; }

    g.beginPath();
    const specs = this.#tree.state;
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
