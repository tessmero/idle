/**
 * @file LayoutsTab gui element
 * contents for the "layouts" tab in the sandbox menu.
 */
class LayoutsTab extends CompositeGuiElement {
  _layoutData = LAYOUTS_TAB_LAYOUT;

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const rows = this._layout.rows;

    const specs = {
      'CONTEXT_MENU_LAYOUT': {
        description: 'Base layout for context menu',

        // presets emulate context_menu.js setting orientation
        presets: [
          {
            '_aspect_ratio': 0.34,
            'orientation': 0,
            'expand': 1,
            'side': 1,
          },
          {
            '_aspect_ratio': 0.66,
            'orientation': 1,
            'expand': 1,
            'side': 1,
          },
        ],
      },
      'BUDDY_CONTEXT_MENU_LAYOUT': {
        ext: 'CONTEXT_MENU_LAYOUT',
        description: 'Extended layout for in-game context menu',
      },
      'TEST_CONTEXT_MENU_LAYOUT': {
        ext: 'CONTEXT_MENU_LAYOUT',
        description: 'Extended layout in test context menu',
      },

      /*
      'STAT_UPGRADER_LAYOUT': {
        description: 'a row in the upgrades tab',

        // should emulate inside of upgrade menu row(s)
        testIconScale: 0.4,
        presets: [
          {
            '_aspect_ratio': 0.05,
            'thick': 0,
          },
          {
            '_aspect_ratio': 0.1,
            'thick': 1,
          },
        ],
      },
      */
      'HUD_GUI_LAYOUT': {
        description: 'in-game heads up display',
      },
      'STORY_GUI_LAYOUT': {
        description: '',
      },
    };

    // build ui rows
    let rowIndex = 1;
    const innerTlrs = [];
    for (const [layoutName, layoutSpecs] of Object.entries(specs)) {

      // let spec entry inherit from one other spec entry
      const { ext } = layoutSpecs;
      const lytSpecs = ext ? { ...specs[ext], ...layoutSpecs } : layoutSpecs;

      // construct one row
      innerTlrs.push(new LayoutListRow(
        rows[rowIndex], {
          context: {
            title: layoutName,
            testLayoutData: window[layoutName],
            ...lytSpecs,
          },
        }
      ));
      rowIndex = rowIndex + 1;
    }

    return innerTlrs;
  }
}
