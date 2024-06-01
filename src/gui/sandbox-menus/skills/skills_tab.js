/**
 * @file Skills Tab gui element
 * Content for the "skills" tab in the sandbox menu.
 */
class SkillsTab extends CompositeGuiElement {
  /**
   *
   * @param sr
   */
  constructor(sr) {
    super(sr);

    const tree = global.skillTree;
    if (!tree) { return; }

    const result = [new SkillTreeGraph(sr, tree)];
    const w = 0.1;
    const h = 0.1;

    for (const [_key, entry] of Object.entries(tree.state)) {
      const [x, y] = entry.pos;
      const rect = [x - w / 2, y - h / 2, w, h];
      const card = new SkillCard(rect, tree, entry);
      card.status = entry.status;
      result.push(card);
    }

    this.setChildren(result);
  }
}
