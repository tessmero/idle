const GameStates = {
  startMenu: 0,
  startTransition: 1,
  playing: 2,
  upgradeMenu: 3,
  pauseMenu: 4,
};

function rebuildGuis() {
  const sr = global.screenRect;
  global.allGuis = [
    new StartMenuGui(sr),
    new StartTransitionGui(sr, true),
    new HudGui(sr),
    new UpgradeMenuGui(sr),
    new PauseMenuGui(sr),
  ];
  global.allGuis.forEach((k) => {
    k.children = k.buildElements();
    k.setScreen(global.mainScreen);
  });
  const gui = global.allGuis[global.gameState];
  global.mainScreen.setGui(gui);
}

function hideWebsiteOverlays() {
  const ids = ['navbar', 'source-link'];
  ids.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) { elem.style.display = 'none'; }
  });
}

function showWebsiteOverlays() {
  const ids = ['navbar', 'source-link'];
  ids.forEach((id) => {
    const elem = document.getElementById(id);
    if (elem) { elem.style.display = 'block'; }
  });
}

function setState(s) {
  if (global.allGuis) {
    global.allGuis[global.gameState].close();
  }
  global.gameState = s;
  if (global.allGuis) {
    const gui = global.allGuis[global.gameState];
    gui.open();
    global.mainScreen.setGui(gui);
  }

  global.shiftHeld = false;
  global.controlHeld = false;
}

// toggle the stats / upgrades menu overlay
function toggleStats() {
  if (global.gameState === GameStates.upgradeMenu) {
    setState(GameStates.playing);
  }
  else {
    global.mainSim.selectedBody = null; // close context menu
    setState(GameStates.upgradeMenu);
  }

}

function resetProgression() {
  let money = 0;
  const s = global.mainSim;
  global.toolList = [
    new DefaultTool(s, global.mouseGrabRadius),
    new CircleTool(s),
    new LineTool(s),
  ];

  if (global.sandboxMode) {
    money = 1e100;
    global.toolList.push(
      new PiTool(s, global.mouseGrabRadius)
    );
  }

  global.mainSim.setTool(global.toolList[0]);
  global.mainSim.rainGroup.n = 100;

  global.mainSim.particlesCollected = money;

  if (!global.sandboxMode) {

    // remove bodies from start menu sim
    global.mainSim.clearBodies();
    global.mainSim.rainGroup.grabbedParticles.clear();
  }
  global.upgradeTracks = new UpgradeTracks();
  global.skillTree = new SkillTree();
  updateAllBonuses();
}

// user clicked play button on start menu
function playClicked() {
  global.sandboxMode = false;

  // show full start transition
  hideWebsiteOverlays();
  setState(GameStates.startTransition);
}

function resume() {
  setState(GameStates.playing);
  hideWebsiteOverlays();
}

function play() {

  // reset for good measure
  // (should have been reset during transition)
  resetProgression();
  resume();
}

// user clicked sandbox button on start menu
function sandboxClicked() {
  const skipTransition = true;

  global.sandboxMode = true;
  hideWebsiteOverlays();

  if (skipTransition) {

    // skip transition
    setColorScheme(ColorScheme.sandbox);// setup.js
    play();

  }
  else {

    // do short transition
    setState(GameStates.startTransition);
  }
}

// called in start_transition_gui.js
function startTransitionFinished() {
  play();
}

function pause() {
  if (global.gameState === GameStates.pauseMenu) {
    setState(GameStates.playing);
  }
  else {
    setState(GameStates.pauseMenu);
  }
  hideWebsiteOverlays();
}

function quit() {
  setState(GameStates.startMenu);
  showWebsiteOverlays();
  resetGame();
}
