/**
 * @file LayoutListRow gui element representing a layout object,
 * in the layouts tab in sandbox mode
 */
class LayoutListRow extends CompositeGuiElement {
  _layoutData = LAYOUTS_ROW_LAYOUT;

  // #title;
  // #testLayoutData;
  // #testIconScale;
  // #presets;
  #context;

  /**
   *
   * @param {number[]} rect
   * @param {object} params
   * @param {object} params.context The LayoutContextMenu context
   */
  constructor(rect, params = {}) {
    super(rect, params);
    const { context } = params;

    this.#context = context;
  }

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;

    const sr = new GuiElement(layout.title, {
      icon: layoutIcon,
      labelFunc: () => this.#context.title,
      scale: 0.4,
      textAlign: 'left',
    });
    sr.isAnimated = () => sr.hovered;

    return [
      new Button(this.rect, {
        titleKey: `inner-${this._titleKey}`,
        action: () => this._llrClicked(),
      }),
      sr,
    ];
  }

  /**
   * Called when this element is clicked.
   * Activate the test context menu which will run the test.
   */
  _llrClicked() {
    const screen = this.screen;
    screen.setContextMenu(
      new LayoutContextMenu(screen.rect, {
        context: this.#context,
      })
    );
  }
}
