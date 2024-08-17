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

  // space between labels (if possible)
  #padBetweenHeaders = 0.05;

  /**
   * tabContent is list of rect->element callbacks
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} params The parameters.
   * @param {string[]} params.tabLabels The labels fot he tab header buttons.
   * @param {Function[]} params.tabContents The functions to build each tab's elements.
   * @param {string[]} params.tabTooltips The tooltips for the tab header buttons.
   */
  constructor(rect, params = {}) {
    super(rect, params);

    const {
      tabTooltips = null,
      tabLabels,
      tabContents,
    } = params;

    this.#tabLabels = tabLabels;
    this.#tabContents = tabContents;
    this.#tabTooltips = tabTooltips;
    this.nTabs = tabLabels.length;
    this.#selectedTabIndex = 0;
  }

  /**
   * Get distance neighboring headers have to overlap so they fit.
   * Returns 0 if tab headers fit easily.
   * @param {number[][]} tabLabelDims the [w,h] of each of the tab labels
   */
  _computeTabHeaderCollapse(tabLabelDims) {
    const maxWidth = this._layout.content[2]; // this.rect[2];
    const p = this.#padBetweenHeaders;
    const totalWidth = tabLabelDims.reduce((total, [w, _h]) => total + w + p, 0);
    if (totalWidth < maxWidth) {
      return 0;
    }
    return (totalWidth - maxWidth) / tabLabelDims.length;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;
    const result = [];

    // check if tab labels will fit easily
    const tabLabels = this.#tabLabels;
    const tabLabelScale = 0.4; // font size
    const tabLabelDims = tabLabels.map(
      (label) => getTextDims(label, tabLabelScale)
    );
    const collapse = this._computeTabHeaderCollapse(tabLabelDims);

    // construct tab header buttons
    const [cx, y, _w, _h] = layout.tabsRow;
    let x = cx + 0.02;
    const p = this.#padBetweenHeaders;
    tabLabels .map((label, i) => {
      const [w, h] = tabLabelDims[i];
      const rr = padRect(x, y, w, h, 0.02);
      x = x + (w + p) - collapse;
      const tb = new TabHeaderButton(rr, {
        parent: this,
        tabIndex: i,
        label,
        action: () => {
          this.#selectedTabIndex = i;
          this.#tabChangeListeners.forEach((l) => l(i));
        },
        tooltip: this.#tabTooltips ? this.#tabTooltips[i] : null,
        scale: tabLabelScale,
      });

      result.push(tb);
    });

    // contents for each tab are technically not children
    // so they aren't all drawn automatically
    const r = this._layout.content;
    const conts = this.#tabContents.map((cons) => cons(r, {
      opaque: true,
      border: new OctBorder(),
    }));
    this.tabContent = conts;

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
