let _defaultGlobalVals = null;

/**
 *
 */
class DebugTab extends CompositeGuiElement {
  /**
   *
   * @param sr
   */
  constructor(sr) {
    super(sr);

    const specs = [

      [
        // tab title, tooltip
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
          ['mainSim.rainGroup.n', 1, 'max raindrops on screen'],
          ['mainSim.fallSpeed', 3e-6, 'terminal velocity'],
          ['mainSim.particleRadius', 0.001, 'size of falling rain drops'],
          ['mainSim.rainGroup.wiggle', 0.01, 'horizontal movement of drops'],

          // ['particleStickyForce', 1e-6, 'force holding particles to edges'],
        ],
      ],

      [
        'UI', 'User Interface\ntext, buttons, and menus', [

          ['debugUiRects', 'bool', 'show bounding rectangles\nused for aligning text\nand mouse hovering'],
          ['baseAnimPeriod', 100, 'idle gui animation\nframe duration'],
          ['textPixelSize', 0.001, 'font size'],
          ['textLetterSpace', 1, 'space between letters'],
          ['textLineSpace', 1, 'space between lines'],
          ['tooltipPadding', 0.001, 'extra space around\ntooltip content'],
          ['tooltipShadowWidth', 0.001, 'size of shadow effect\nfor tooltip popups'],
          ['lineWidth', 0.001, 'line thickness'],
        ],
      ],
    ];

    // remember default values based on global.js contents
    if (!_defaultGlobalVals) {
      _defaultGlobalVals = {};
      specs.forEach((r) => r[2].forEach((rr) => {
        const varname = rr[0];
        _defaultGlobalVals[varname] = getGlobal(varname);
      }));
    }

    // let tabLabels = ['upgrades','skills','debug']
    const tabLabels = specs.map((r) => r[0]);
    const tabTooltips = specs.map((r) => r[1]);
    const tabContent = specs.map((r) => (
      (rect) => this.buildTabContent(rect, r[2])
    ));
    const rect = padRect(...sr, -0.05);
    const tabGroup = new TabPaneGroup(rect, tabLabels, tabContent, tabTooltips);
    if (global.debugMenuTabIndex) { tabGroup.setSelectedTabIndex(global.debugMenuTabIndex); }
    tabGroup.addTabChangeListener((i) => {
      global.debugMenuTabIndex = i;
    });

    this.children = [tabGroup];
  }

  /**
   *
   * @param rect
   * @param tabSpecs
   */
  buildTabContent(rect, tabSpecs) {

    const sr = rect;
    const m = 0.03;
    const w = sr[2] - 2 * m;
    const h = 0.05;
    let r0 = [sr[0] + m, sr[1] + m * 2, w, h];

    const result = new CompositeGuiElement(rect);
    result.children = tabSpecs.map((row) => {
      const varname = row[0];
      const inc = row[1];
      const tooltip = row[2];
      const agvRect = r0;
      r0 = [...r0];
      r0[1] = r0[1] + r0[3];
      if (inc === 'bool') {
        return new BooleanDebugVar(agvRect, varname, tooltip);
      }

      return new ScalarDebugVar(agvRect, varname, inc, tooltip);

    });
    return result;
  }
}
