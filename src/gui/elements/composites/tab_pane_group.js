/**
 *
 */
class TabPaneGroup extends CompositeGuiElement {

  // tabContent is list of rect->element callbacks
  /**
   *
   * @param rect
   * @param tabLabels
   * @param tabContents
   * @param tabTooltips
   */
  constructor(rect, tabLabels, tabContents, tabTooltips = null) {
    super(rect);
    this.tabLabels = tabLabels;
    this._selectedTabIndex = 0;

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
          this._selectedTabIndex = ii;
          if (this.tabChangeListeners) { this.tabChangeListeners.forEach((l) => l(ii)); }
        }
      );
      if (tabTooltips) { tb.withTooltip(tabTooltips[i]); }

      tb.setScale(tabLabelScale);
      this.children.push(tb);
      i = i + 1;
    });

    // content for each tab
    const r = [...rect];
    r[1] = r[1] + tabHeaderHeight;
    r[3] = r[3] - tabHeaderHeight;
    this.tabContent = tabContents.map((cons) => cons(r).withOpacity(true));

    this.nTabs = tabLabels.length;
    this._selectedTabIndex = 0;
  }

  /**
   *
   * @param i
   */
  setSelectedTabIndex(i) {
    this._selectedTabIndex = nnmod(i, this.nTabs);
  }

  /**
   *
   */
  getSelectedTabIndex() {
    return this._selectedTabIndex;
  }

  /**
   *
   * @param s
   */
  setScreen(s) {
    super.setScreen(s);
    this.tabContent.forEach((tb) => tb.setScreen(s));
  }

  /**
   *
   * @param l
   */
  addTabChangeListener(l) {
    if (!this.tabChangeListeners) {
      this.tabChangeListeners = [];
    }
    this.tabChangeListeners.push(l);
  }

  /**
   *
   * @param dt
   * @param disableHover
   */
  update(dt, disableHover) {
    super.update(dt, disableHover);
    this.tabContent[this._selectedTabIndex].update(dt, disableHover);
  }

  /**
   *
   * @param g
   */
  draw(g) {
    this.tabContent[this._selectedTabIndex].draw(g); // draw tab content
    super.draw(g); // draw tab labels
  }

  /**
   *
   */
  click() {
    return super.click() || // click tab label
            this.tabContent[this._selectedTabIndex].click(); // click tab content
  }
}
