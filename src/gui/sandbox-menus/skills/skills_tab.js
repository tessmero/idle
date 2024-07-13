/**
 * @file Skills Tab gui element
 * Content for the "skills" tab in the sandbox menu.
 */
class SkillsTab extends CompositeGuiElement {

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const tree = global.skillTree;
    if (!tree) { return []; }

    const w = 0.1;
    const h = 0.1;

    const cards = Object.entries(tree.state).map(([_key, entry]) => {
      const [x, y] = entry.pos;
      const rect = [x - w / 2, y - h / 2, w, h];
      const card = new SkillCard(rect, tree, entry);
      card.status = entry.status;
      return card;
    });

    return [new SkillTreeGraph(this.rect, tree), ...cards];
  }
}
