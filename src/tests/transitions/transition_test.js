class TransitionTest extends Test {
  constructor() {
    super();
  }

  buildScreen() {
    const sim = new TutorialPSim();
    const gui = new StartTransitionGui(sim.rect, false);
    const tut = null;
    const screen = new GameScreen(sim.rect, sim, gui, tut);
    screen.rebuildGui = () => new StartTransitionGui(sim.rect, false);

    // start watching some points on the screen
    const watcher = new PointWatcherGW(sim.rect);
    screen.graphicsWrapper = watcher;
    this.watcher = watcher;

    gui.setScreen(screen);
    return screen;
  }

  getTestAssertions(_sim) {
    const w = this.watcher;
    return [
      [100, 'mostly uncovered', () => w.getFgRate() < 0.50],

      [1500, '90% covered', () => w.getFgRate() > 0.90],

      [3000, '90% covered', () => w.getFgRate() > 0.90],

      [6000, 'mostly uncovered', () => w.getFgRate() < 0.50],
    ];
  }

  getTitle() {
    return 'Transition';
  }
}
