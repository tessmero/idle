/**
 * @file TestTimelineDisplay gui element
 * progress indicator with checkboxes
 */
class TestTimelineDisplay extends CompositeGuiElement {

  /**
   *
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters.
   * @param {number} params.duration The total milliseconds in the timeline.
   * @param {number[]} params.checkTimes The times when checks are performed,
   *                                     in milliseconds from start of test.
   * @param {string[]} params.checkLabels The labels for the checks.
   */
  constructor(rect, params = {}) {
    super(rect, params);
    this.duration = params.duration;
    this.checkTimes = params.checkTimes;
    this.checkLabels = params.checkLabels;
    this.t = 0;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const duration = this.duration;
    const checkTimes = this.checkTimes;
    const checkLabels = this.checkLabels;

    const innerRect = padRect(...this.rect, -0.001);
    this.innerRect = innerRect;

    // position icon for each checkpoint in timeline
    const boxes = [];
    const boxRad = 0.01;
    for (let i = 0; i < checkTimes.length; i++) {
      const t = checkTimes[i];
      const label = checkLabels[i];
      const x = innerRect[0] + (t / duration) * innerRect[2];
      const r = [x - boxRad, innerRect[1] - 0.02, 2 * boxRad, 2 * boxRad];
      boxes.push(new IconElement(r, {
        icon: uncheckedIcon,
        scale: 0.25,
        tooltip: label,
        tooltipScale: 0.25,
      }));
    }
    this.checkboxes = boxes;

    return [

      ...this.checkboxes,
      new ProgressIndicator(innerRect, {
        valueFunc: () => this.t / this.duration,
        border: null,
      }),
    ];
  }

  /**
   * Draw the test timeline display.
   * @param {object} g The graphics context.
   */
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

  /**
   * Set the time elapsed to display.
   * @param {number} t The millisecs to show as elapsed
   *                   since the start of the test.
   */
  setTime(t) {
    this.t = t;
  }

  /**
   * Set the displayed checked/unchecked status of one checkbox.
   * @param {number} i The index of the checkbox.
   * @param {Icon} icon The icon instance to display,
   *                    checkedIcon or uncheckedIcon
   */
  setCheckboxIcon(i, icon) {
    this.checkboxes[i].icon = icon;
  }
}
