/**
 * @file TabPaneGroup gui element
 *
 * Contains multiple content panels, only one is shown,
 * tab header buttons are used to switch.
 */
class TabPaneGroup extends CompositeGuiElement {

  #selectedTabIndex = 0;
  #tabChangeListeners = [];

  /**
   * tabContent is list of rect->element callbacks
   * @param {number[]} rect The rectangle to align elements in.
   * @param {string[]} tabLabels The labels fot he tab header buttons.
   * @param {Function[]} tabContents The functions to build each tab's elements.
   * @param {string[]} tabTooltips The tooltips for the tab header buttons.
   */
  constructor(rect, tabLabels, tabContents, tabTooltips = null) {
    super(rect);
    this.tabLabels = tabLabels;

    let x = rect[0];
    let y = rect[1];
    const pad = 0.02;
    y = y + pad;

    // tab labels at top
    let i = 0;
    const p = 0.05;
    x = x + p;
    const tabLabelScale = 0.5;
    let tabHeaderHeight = 0;
    tabLabels.map((label) => {
      const [w, h] = getTextDims(label, tabLabelScale);
      const rr = padRect(x, y, w, h, pad);
      rr[1] = rr[1] + 0.01;
      tabHeaderHeight = rr[3];
      const ii = i;
      x = x + (w + p);
      const tb = new TabHeaderButton(this, ii, rr, label,
        () => {
          this.#selectedTabIndex = ii;
          this.#tabChangeListeners.forEach((l) => l(ii));
        }
      );
      if (tabTooltips) { tb.withTooltip(tabTooltips[i]); }

      tb.setScale(tabLabelScale);
      this.addChild(tb);
      i = i + 1;
    });

    // content for each tab
    const r = [...rect];
    r[1] = r[1] + tabHeaderHeight;
    r[3] = r[3] - tabHeaderHeight;
    this.tabContent = tabContents.map((cons) => cons(r).withOpacity(true));

    this.nTabs = tabLabels.length;
    this.#selectedTabIndex = 0;
  }

  /**
   * Make a tab visible.
   * @param {number} i The index of the tab to display.
   */
  setSelectedTabIndex(i) {
    this.#selectedTabIndex = nnmod(i, this.nTabs);
  }

  /**
   * @returns {number} The index of the currently displayed tab.
   */
  getSelectedTabIndex() {
    return this.#selectedTabIndex;
  }

  /**
   * Set the containing screen recursively.
   * @param {GameScreen} s The screen containing this.
   */
  setScreen(s) {
    super.setScreen(s);
    this.tabContent.forEach((tb) => tb.setScreen(s));
  }

  /**
   * Register new tab change callback.
   * @param {Function} l The callback function.
   */
  addTabChangeListener(l) {
    this.#tabChangeListeners.push(l);
  }

  /**
   *
   * @param {number} dt The time elapsed in millseconds.
   * @param {boolean} disableHover
   */
  update(dt, disableHover) {
    super.update(dt, disableHover);
    this.tabContent[this.#selectedTabIndex].update(dt, disableHover);
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    this.tabContent[this.#selectedTabIndex].draw(g); // draw tab content
    super.draw(g); // draw tab labels
  }

  /**
   *
   */
  click() {
    return super.click() || // click tab label
            this.tabContent[this.#selectedTabIndex].click(); // click tab content
  }
}
