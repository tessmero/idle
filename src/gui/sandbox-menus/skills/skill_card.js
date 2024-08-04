/**
 * @file SkillCard gui element
 * represents a skill by displaying its thumbnail screen
 * and an overlay to indicate locked/unlocked status.
 */
class SkillCard extends CompositeGuiElement {

  #tree;
  #entry;

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} tree The SkillTree isntance, global.skillTree.
   * @param {object} entry The value in tree.state containing specs for one skill.
   */
  constructor(rect, tree, entry) {
    super(rect);
    this.#tree = tree;
    this.#entry = entry;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {

    const tree = this.#tree;
    const entry = this.#entry;
    const r = this.rect;
    const skill = Skill[entry.skill];
    const screen = skill.getThumbnailScreen();
    const gsp = new GuiScreenPanel(this.rect, {
      innerScreen: screen,
      border: new SnowglobeBorder(),
    });

    const frac = 0.4;
    const [x, y, w, h] = r;
    let rr = [x + w * (1 - 0.5 * frac), y + h * (1 - 0.5 * frac), w * frac, h * frac];

    let icon = lockIcon;
    let tooltip = '';
    if (entry.status === 'locked') {
      icon = lockIcon;
      const required = tree.state[entry.requires].skill;
      tooltip = `locked\nrequires: ${Skill[required].name}`;
      rr = padRect(x, y, w, h, -h / 8);
    }
    else if (entry.status === 'available') {
      icon = uncheckedIcon;
      tooltip = 'available';

      // if( entry.precludes ){
      //    let precluded = tree.state[entry.precludes].skill.name
      //    tooltip += `\nprecludes: ${precluded}`
      // }
    }
    else if (entry.status === 'purchased') {
      icon = checkedIcon;
      tooltip = 'purchased';
    }
    tooltip = `skill: ${skill.name}}\n${tooltip}`;
    const statusIcon = new IconButton(rr, { icon, tooltip, scale: 0.3 });
    gsp.tooltip = tooltip;

    this.gsp = gsp;
    this.statusIcon = statusIcon;

    return [
      gsp,
      statusIcon,
    ];
  }
}
