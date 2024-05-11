
class HudGui extends Gui {

  constructor() {
    super();
  }

  // implement gui
  buildElements() {
    const sc = global.screenCorners;
    let sr = global.screenRect;
    const margin = 0.02;
    sr = padRect(...sr, -margin);
    const m = 0.1;

    // layout buttons at top of screen
    const topLeft = [sr[0], sr[1], m, m];
    const topRight = [sc[2].x - m - margin, sr[1], m, m];

    // stat redouts at dop of screen
    const topClp = [sr[0] + sr[2] * 0.1, sr[1] + 0.01];
    const topCenterP = [sr[0] + sr[2] * 0.4, topClp[1]];
    const topCrp = [sr[0] + sr[2] * 0.7, topClp[1]];

    // layout toolbar at bottom of screen
    const toolList = global.toolList;
    const nbuttons = toolList.length;
    const padding = 0.005;
    const buttonWidth = m - padding * 2;
    const rowHeight = buttonWidth + padding * 2;
    const rowWidth = buttonWidth * nbuttons + padding * (nbuttons + 1);
    const brow = [sr[0] + sr[2] / 2 - rowWidth / 2, sr[1] + sr[3] - rowHeight, rowWidth, rowHeight];
    const slots = [];
    for (let i = 0; i < nbuttons; i++) {
      slots.push([brow[0] + padding + i * (buttonWidth + padding), brow[1] + padding, buttonWidth, buttonWidth]);
    }

    // build top hud
    let result = [

      // stats button
      new IconButton(topLeft, statsIcon, toggleStats) // game_state.js
        .withTooltip('toggle upgrades menu'),

      // stat readouts constructed with null width and height
      // dims are computed in dynamic_text_label.js

      // particles on screen
      new StatReadout(topClp, rainIcon, () =>
        global.mainSim.rainGroup.n.toString())
        .withStyle('hud')
        .withDynamicTooltip(() => `max ${global.mainSim.rainGroup.n} raindrops on screen`)
        .withAutoAdjustRect(true),

      // sandbox banner
      global.sandboxMode ?
        new DynamicTextLabel(topCenterP, () => 'SANDBOX MODE')
          .withAutoAdjustRect(true)
          .withScale(0.5) :
        null,

      // catch rate %
      global.sandboxMode ? null :
        new StatReadout(topCenterP, catchIcon, () => this.getPct())
          .withStyle('hud')
          .withDynamicTooltip(() => this.getPctTooltip())
          .withAutoAdjustRect(true),

      // total caught
      global.sandboxMode ? null :
        new StatReadout(topCrp, collectedIcon, () =>
          global.mainSim.particlesCollected.toFixed(0))
          .withStyle('hud')
          .withDynamicTooltip(() => `${global.mainSim.particlesCollected.toFixed(0)} raindrops collected`)
          .withAutoAdjustRect(true),

      // pause button
      new IconButton(topRight, pauseIcon, pause) // game_state.js
        .withTooltip('pause or quit the game'),
    ];

    // remove null placeholders used to
    // conveniently toggle things above
    result = result.filter(Boolean);

    // build toolbar buttons
    for (let i = 0; i < toolList.length; i++) {

      const tool = toolList[i];
      const button = new ToolbarButton(slots[i], tool, i);

      const tooltip = tool.tooltip; // tooltip string

      // check if tutorial available
      const tut = tool.getTutorial();
      if (tut) {

        // build tooltip with string label and tutorial sim
        button.withDynamicTooltip(() => {
          const rect = ToolbarTooltipPopup.pickRect(tooltip);
          return new ToolbarTooltipPopup(rect, tooltip, tut, tool);
        });

      }
      else {

        // set tooltip string
        // standard text tooltip (gui_element.js)
        button.withTooltip(tooltip);
      }

      result.push(button);
    }

    return result;
  }

  // get catch percentage string e.g. '50%'
  getPct() {
    const amt = global.mainSim.rainGroup.grabbedParticles.size();
    const total = global.mainSim.rainGroup.n;
    const pct = 100 * amt / total;
    return `${pct.toFixed(0)}%`;
  }

  // get catch percentage explaination string
  getPctTooltip() {
    const amt = global.mainSim.rainGroup.grabbedParticles.size();
    const total = global.mainSim.rainGroup.n;
    return `caught ${amt} / ${total} raindrops`;
  }
}
