class TutorialTest extends Test {

  constructor(tut) {
    super();
    this.tut = tut;
  }

  buildScreen() {
    const sim = this.tut.buildSim();
    const gui = null;
    const tut = this.tut;
    return new GameScreen(sim.rect, sim, gui, tut);
  }

  getTitle() {
    return this.tut.getTitle();
  }

  getDuration() {
    return Math.max(
      super.getDuration(), // duration for test assertions
      this.tut.getDuration()); // duration for tutorial animation
  }
}
