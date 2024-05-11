class StatsTab extends CompositeGuiElement {
  constructor(sr) {
    super(sr);

    let r = padRect(...sr, -0.05);

    // reassign or append to this.children
    if (global.bonusSummary) {
      const dy = 0.15;
      r = [r[0], r[1], r[2], dy];
      global.bonusSummary.forEach((entry) => {
        const [icon, summary] = entry;
        this.children.push(new StatReadout(
          [...r], icon, () => summary).withScale(0.4));
        r[1] = r[1] + dy;
      });
    }
  }
}
