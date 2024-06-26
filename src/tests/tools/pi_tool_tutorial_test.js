/**
 * @file Test for particle inpsector tool.
 */
class PiToolTutorialTest extends Test {
  title = 'Inspector Test';
  macro = new PiToolTutorial();

  /**
   *
   * @param {GameScreen} screen The screen under test.
   */
  getTestAssertions(screen) {
    const sim = screen.sim;
    return [
      // time, label, func
      [0, 'no particle selected', () => sim.selectedParticle === null],
      [1200, 'particle selected', () => sim.selectedParticle !== null],
      [1400, 'particle at bottom', () => {
        const sp = sim.selectedParticle;
        if (!sp) { return false; }
        const [_subgroup, _i, x, y, _dx, _dy, _hit] = sp;
        const relPos = Test.relPos(sim, v(x, y));
        return relPos.y > 0.5;
      }],
      [3200, 'particle at top', () => {
        const sp = sim.selectedParticle;
        if (!sp) { return false; }
        const [_subgroup, _i, x, y, _dx, _dy, _hit] = sp;
        const relPos = Test.relPos(sim, v(x, y));
        return relPos.y < 0.5;
      }],
    ];
  }
}
