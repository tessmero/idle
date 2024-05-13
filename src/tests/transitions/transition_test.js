class TransitionTest extends Test {
  constructor() {
    super();
  }

  buildScreen() {
    const sim = new TutorialPSim();
    const gui = new StartTransitionGui(sim.rect, false);
    const tut = null;
    const screen = new GameScreen(sim.rect, sim, gui, tut);
    gui.setScreen(screen);
    return screen;
  }

  getTestAssertions(_sim) {
    return [
      [6000, 'TODO criteria', () => false],
    ];
  }

  getTitle() {
    return 'Transition';
  }
}
