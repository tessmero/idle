
/**
 * @file StateUpgrader gui element.
 * a stat readout with button to upgrade
 * modifies one entry in global.upgradeTracks.state
 */
class StatUpgrader extends CompositeGuiElement {

  #key;
  #gutse;

  /**
   * key should exist in global.upgradeTracks.state
   * @param {number[]} rect The rectangle to align elements in.
   * @param key
   */
  constructor(rect, key) {
    super(rect);
    this.#key = key;
    const gutse = global.upgradeTracks.state[key];
    this.#gutse = gutse;

    let r = this.rect;
    const sl = Math.min(r[2], r[3]);
    r = [r[0], r[1], sl, sl];

    // upgrade button
    const buttonWidth = 0.15;
    const rbutton = padRect(r[0], rect[1], buttonWidth, r[3], -global.lineWidth * 2);
    const btn = new TextButton(rbutton, 'upgrade', () => this.upgradeButtonClicked()).withScale(0.3);

    // upgrade cost progress indicator
    // overlay on upgrade button
    const btno = new ProgressIndicator(rbutton, () => {
      const screen = this.screen;
      const budget = screen.sim.particlesCollected;
      const cost = gutse.cost.f(gutse.level - 1);
      return budget / cost;
    }).withOutline(false);

    // visual progression display
    const displayWidth = 0.4;
    const rdisp = padRect(r[0] + buttonWidth, r[1], displayWidth, rect[3], 0);
    this.progressDisplayRect = rdisp;

    // text label
    const dx = 0.02 + buttonWidth + displayWidth;
    const rlabel = [r[0] + dx, r[1], r[2] - dx, r[3]];
    const dtl = new StatReadout(rlabel, gutse.icon, () => `${key}`);
    dtl.setScale(0.4);
    dtl.tooltipScale = 0.4;
    dtl.setCenter(false);

    this.setChildren([btn, btno, dtl]);
  }

  /**
   *
   */
  tooltipFunc() {
    const key = this.#key;
    const gutse = this.#gutse;
    const lvl = gutse.level;
    const cost = gutse.cost.f(lvl - 1);
    const curVal = gutse.value.f(lvl - 1);
    const nextVal = gutse.value.f(lvl);
    const subject = gutse.subject;

    return [
      key,
      `level ${lvl}: ${curVal}${subject}`,
      `upgrade costs ${cost} raindrops`,
      `-> level ${lvl + 1}: ${nextVal}${subject}`,
    ].join('\n');
  }

  /**
   * Called when our button is clicked.
   */
  upgradeButtonClicked() {
    const gutse = this.#gutse;
    const sim = this.screen.sim;
    const budget = sim.particlesCollected;
    const lvl = gutse.level;
    const cost = gutse.cost.f(lvl - 1);
    if (cost > budget) {
      this.setTemporaryTooltip('collect more raindrops!');
      return;
    }
    if (lvl >= gutse.maxLevel) {
      this.setTemporaryTooltip('max level!');
      return;
    }

    sim.particlesCollected = sim.particlesCollected - cost;
    const screen = this.screen;
    screen.floaters.signalChange(screen.mousePos, -cost);
    gutse.level = gutse.level + 1;
    updateAllBonuses();
    this.setTemporaryTooltip('upgrade purchased!');
  }

  /**
   * Draw this stat upgrader.
   * @param {object} g the Graphics context.
   */
  draw(g) {
    Button._draw(g, this.rect);
    super.draw(g);

    const gutse = this.#gutse;
    const r = this.progressDisplayRect;
    const pad = 0.01;
    const sl = r[3] - pad * 2;// box size

    const x = r[0] + pad;
    const y = r[1] + pad;
    const dx = sl + pad;

    // draw progression display boxes
    g.strokeStyle = global.colorScheme.fg;
    g.fillStyle = global.colorScheme.fg;
    g.lineWidth = global.lineWidth;
    for (let i = 0; i < gutse.maxLevel; i++) {
      const box = [x + i * dx, y, sl, sl];
      if (i < gutse.level) {
        g.fillRect(...box);
      }
      else {
        g.strokeRect(...box);
      }
    }
  }
}
