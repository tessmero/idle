class TestListRow extends CompositeGuiElement {
  constructor(rect, test, testIndex) {
    super(rect);
    this.test = test;
    this.testIndex = testIndex;

    const sr = new StatReadout(rect,
      playIcon, () => test.getTitle())
      .withScale(0.4);

    sr.isAnimated = () => sr.hovered || this.isActive();

    this.children = [
      new Button(rect, () => this.clicked()),
      sr,
    ];
  }

  draw(g) {
    super.draw(g);

    if (this.isActive()) {
      ProgressIndicator._draw(g, this.rect, 1);
    }
  }

  isActive() {
    const c = this.getScreen().contextMenu;
    return c && (c.testIndex === this.testIndex);
  }

  clicked() {
    // position context menu on bottom/right
    const screen = this.getScreen();
    const rects = TestContextMenu.pickRects(screen.rect);
    screen.contextMenu = new TestContextMenu(...rects, this.test, this.testIndex);
    screen.contextMenu.setScreen(screen);
  }
}