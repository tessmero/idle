// context menu (and reticle effect)
// that appears when a body is clicked
class BuddyContextMenu extends BodyContextMenu {
  constructor(rect, s0, s1, buddy) {
    super(rect, s0, s1, buddy.getMainBody());
    this.buddy = buddy;

    // divide content squares into rows
    // const topRows = divideRect(...s0, 4, true);
    const botRows = divideRect(...s1, 4, true);

    this.children = this.children.concat([

      new StatReadout(botRows[0], collectedIcon, () =>
        buddy.particlesCollected.toString())
        .withStyle('hud')
        .withDynamicTooltip(() => `${buddy.particlesCollected} rain drops collected`)
        .withAutoAdjustRect(true),
    ]);
  }
}
