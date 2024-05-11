// progress indicator with checkboxes
class TestTimelineDisplay extends CompositeGuiElement {
  constructor(rect, duration, checkTimes, checkLabels) {
    super(rect);
    this.duration = duration;
    this.checkTimes = checkTimes;
    this.checkLabels = checkLabels;
    this.t = 0;

    const innerRect = padRect(...rect, -0.01);
    this.innerRect = innerRect;

    // position icon for each checkpoint in timeline
    const boxes = [];
    const boxRad = 0.02;
    for (let i = 0; i < checkTimes.length; i++) {
      const t = checkTimes[i];
      const label = checkLabels[i];
      const x = innerRect[0] + (t / duration) * innerRect[2];
      const r = [x - boxRad, innerRect[1] - 0.05, 2 * boxRad, 2 * boxRad];
      boxes.push(new IconButton(r, uncheckedIcon, () => {})
        .withScale(0.2)
        .withTooltip(label)
        .withTooltipScale(0.25));
    }
    this.checkboxes = boxes;

    this.children = [

      ...this.checkboxes,
      new ProgressIndicator(innerRect, () => this.t / this.duration)
        .withOutline(false),
    ];
  }

  draw(g) {

    // position line with tick marks
    const [x, y, w, h] = this.innerRect;
    const specs = [
      [
        [x, y + h / 2],
        [x + w, y + h / 2],
      ],
    ];
    for (let t = 0; t < this.duration; t = t + 1000) {
      const tx = x + w * t / this.duration;
      specs.push([
        [tx, y],
        [tx, y + h],
      ]);
    }

    // draw lines
    g.lineWidth = global.lineWidth;
    g.strokeStyle = global.colorScheme.fg;
    g.beginPath();
    specs.forEach((entry) => {
      g.moveTo(...entry[0]);
      g.lineTo(...entry[1]);
    });
    g.stroke();

    // draw children
    super.draw(g);
  }

  setTime(t) {
    this.t = t;
  }

  setCheckboxIcon(i, icon) {
    this.checkboxes[i].icon = icon;
  }
}
