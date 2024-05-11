// gui element representing a skill
class SkillCard extends CompositeGuiElement {

  constructor(rect, tree, entry) {
    super(rect);
    const r = this.rect;
    const sim = entry.skill.getThumbnailSim();
    const gsp = new GuiSimPanel(rect, sim);

    const frac = 0.4;
    const [x, y, w, h] = r;
    let rr = [x + w * (1 - 0.5 * frac), y + h * (1 - 0.5 * frac), w * frac, h * frac];

    let icon = lockIcon;
    let tooltip = '';
    if (entry.status === 'locked') {
      icon = lockIcon;
      const required = tree.state[entry.requires].skill.name;
      tooltip = `locked\nrequires: ${required}`;
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
    tooltip = `skill: ${entry.skill.name}\n${tooltip}`;
    const statusIcon = new IconButton(rr, icon, () => {}).withScale(0.3).withTooltip(tooltip);
    gsp.tooltip = tooltip;

    this.gsp = gsp;
    this.statusIcon = statusIcon;

    this.children = [
      gsp,
      statusIcon,
    ];

  }
}
