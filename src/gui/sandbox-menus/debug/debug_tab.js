/**
 * @file DebugTab gui element.
 * Contents for the "debug" tab in the sandbox menu.
 */
class DebugTab extends CompositeGuiElement {
  _layoutData = NESTED_TAB_PANE_LAYOUT;

  /**
   * Construct direct children for this composite.
   * @returns {GuiElement[]} The children.
   */
  _buildElements() {
    const layout = this._layout;

    const specs = [

      [
        // tab title, tooltip
        'UI', 'User Interface\ntext, buttons, and menus', [

          ['debugCssRects', 'bool', 'show bounding rectangles\ndefined by css rules in data folder'],
          ['debugUiRects', 'bool', 'show bounding rectangles\nmay involve one-off math in src folder'],
          ['baseAnimPeriod', 100, 'idle gui animation\nframe duration'],
          ['textPixelSize', 0.001, 'font size'],
          ['textLetterSpace', 1, 'space between letters'],
          ['textLineSpace', 1, 'space between lines'],
          ['tooltipShadowWidth', 0.001, 'size of shadow effect\nfor tooltip popups'],
          ['lineWidth', 0.001, 'line thickness'],
        ],
      ],

      [
        'SIM', 'Simulation\nbodies and physics particls', [

          // variable name in global.js,  increment or 'bool',  description
          ['colorcodeParticles', 'bool', 'color particles by category'],
          ['showEdgeSpokesA', 'bool', 'show edge shape\naround center of mass'],
          ['showEdgeSpokesB', 'bool', 'show edge shape\naround center of mass'],
          ['showEdgeNormals', 'bool', 'show normal vectors along edges'],
          ['showEdgeVel', 'bool', 'show velocity vectors along edges'],
          ['showEdgeAccel', 'bool', 'show force vectors along edges'],

          // ['debugGrabbers', 'bool', 'show regions where particles\nmay be affected by bodies'],
          ['bodyFriction', 1e-3, 'friction for circles and lines'],
        ],
      ],

      [
        // tab title, tooltip
        'RAIN', 'Falling Rain\nprocedural particles', [

          // variable name in global.js,  increment or 'bool',  description
          ['rootScreen.sim.rainGroup.n', 1, 'max raindrops on screen'],
          ['rootScreen.sim.fallSpeed', 3e-6, 'terminal velocity'],
          ['rootScreen.sim.particleRadius', 0.001, 'size of falling rain drops'],
          ['rootScreen.sim.rainGroup.wiggle', 0.01, 'horizontal movement of drops'],

          // ['particleStickyForce', 1e-6, 'force holding particles to edges'],
        ],
      ],
    ];

    // let tabLabels = ['upgrades','skills','debug']
    const tabLabels = specs.map((r) => r[0]);
    const tabTooltips = specs.map((r) => r[1]);
    const tabContents = specs.map((r) => (
      (rect) => this.buildTabContent(rect, r[2])
    ));
    const tabGroup = new TabPaneGroup(layout.inner, tabLabels, tabContents, tabTooltips);
    if (global.debugMenuTabIndex) { tabGroup.setSelectedTabIndex(global.debugMenuTabIndex); }
    tabGroup.addTabChangeListener((i) => {
      global.debugMenuTabIndex = i;
    });

    return [tabGroup];
  }

  /**
   * Build content for a tab within the debug tab.
   * @param {number[]} rect The rectangle to align elements in.
   * @param {object} tabSpecs Specifications for the tab.
   */
  buildTabContent(rect, tabSpecs) {
    const result = new CompositeGuiElement(rect);
    result._layoutData = DEBUG_TAB_LAYOUT;
    result._buildElements = () => tabSpecs.map((rowSpecs, i) => {
      const [varname, inc, tooltip] = rowSpecs;
      const r = result._layout.rows[i];
      if (inc === 'bool') {
        return new BooleanDebugVar(r, varname, tooltip);
      }
      return new ScalarDebugVar(r, varname, inc, tooltip);

    });
    return result;
  }
}
