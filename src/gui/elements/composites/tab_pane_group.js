/**
 * @file TabPaneGroup gui element
 *
 * Contains multiple content panels, only one is shown,
 * tab header buttons are used to switch.
 */
class TabPaneGroup extends CompositeGuiElement {
  _layoutData = TAB_PANE_LAYOUT;

  #selectedTabIndex = 0;
  #tabChangeListeners = [];

  #tabLabels;
  #tabContents;
  #tabTooltips;

  /**
   * tabContent is list of rect->element callbacks
   * @param {number[]} rect The rectangle to align elements in.
   * @param {string[]} tabLabels The labels fot he tab header buttons.
   * @param {Function[]} tabContents The functions to build each tab's elements.
   * @param {string[]} tabTooltips The tooltips for the tab header buttons.
   */
  constructor(rect, tabLabels, tabContents, tabTooltips = null) {
    super(rect);
    this.#tabLabels = tabLabels;
    this.#tabContents = tabContents;
    this.#tabTooltips = tabTooltips;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const result = [];

    // tab labels at top
    let i = 0;
    const p = 0.05;
    const tabLabelScale = 0.5;
    const [cx, y, _w, _h] = layout.tabsRow;
    let x = cx + 0.02;
    this.#tabLabels.map((label) => {
      const [w, h] = getTextDims(label, tabLabelScale);
      const rr = padRect(x, y, w, h, 0.02);
      const ii = i;
      x = x + (w + p);
      const tb = new TabHeaderButton(this, ii, rr, label,
        () => {
          this.#selectedTabIndex = ii;
          this.#tabChangeListeners.forEach((l) => l(ii));
        }
      );
      if (this.#tabTooltips) { tb.withTooltip(this.#tabTooltips[i]); }

      tb.setScale(tabLabelScale);
      result.push(tb);
      i = i + 1;
    });

    // contents for each tab are technically not children
    // so they aren't all drawn automatically
    const r = this._layout.content;
    const conts = this.#tabContents.map((cons) => cons(r, screen).withOpacity(true));
    this.tabContent = conts;

    this.nTabs = this.#tabLabels.length;
    this.#selectedTabIndex = 0;

    return result;
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
    if (this.tabContent) { this.tabContent.forEach((tb) => tb.setScreen(s)); }
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
    if (this.tabContent) { this.tabContent[this.#selectedTabIndex].update(dt, disableHover); }
  }

  /**
   *
   * @param {object} g The graphics context.
   */
  draw(g) {
    if (this.tabContent) { this.tabContent[this.#selectedTabIndex].draw(g); } // draw tab content
    super.draw(g); // draw tab labels
  }

  /**
   * Recursively populate #children with gui elements.
   * @param {GameScreen} screen The screen containing this.
   */
  buildElements(screen) {
    super.buildElements(screen);
    if (this.tabContent) { this.tabContent.forEach((e) => e.buildElements(screen)); }
  }

  /**
   *
   */
  click() {
    return super.click() || // click tab label
            (this.tabContent && this.tabContent[this.#selectedTabIndex].click()); // click tab content
  }
}
