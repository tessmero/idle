const GameStates = {
    startMenu: 0,
    startTransition: 1,
    playing: 2,
    upgradeMenu: 3,
    pauseMenu: 4,
}

function rebuildGuis(){
    global.allGuis = [
         new StartMenuGui(),
         new StartTransitionGui(),
         new HudGui(),
         new UpgradeMenuGui(),
         new PauseMenuGui(),
    ]
    global.allGuis.forEach(k => {
        k.children = k.buildElements()
    })
}

function hideWebsiteOverlays(){
    let ids = ['navbar','source-link']
    ids.forEach( id => {
        let elem = document.getElementById(id)
        if( elem ) elem.style.display = "none";
    })
}

function showWebsiteOverlays(){
    let ids = ['navbar','source-link']
    ids.forEach( id => {
        let elem = document.getElementById(id)
        if( elem ) elem.style.display = "block";
    })
}

// toggle the stats / upgrades menu overlay
function toggleStats(){
    if( global.gameState != GameStates.upgradeMenu ){
        global.mainSim.selectedBody = null // close context menu
        setState( GameStates.upgradeMenu )
    } else {
        setState( GameStates.playing )
    }
    
}
 
function resetProgression()
{
    
    global.selectedToolIndex = 0
    global.mainSim.rainGroup.n = 100
    global.mainSim.particlesCollected = 0
    global.mainSim.clearBodies()
    global.mainSim.rainGroup.grabbedParticles.clear()
    global.activeReleasePatterns = []
    global.upgradeTracks = new UpgradeTracks()
    global.skillTree = new SkillTree()
    updateAllBonuses()
}

// called when user clicks play button
function playClicked(){
    setState( GameStates.startTransition )
    hideWebsiteOverlays()
}

// called when start transition ends
function play(){
    
    // reset for good measure
    // (should have been reset during transition)
    resetProgression()
    resume()
}

function resume(){
    setState( GameStates.playing )
    hideWebsiteOverlays()
}

function pause(){
    if( global.gameState != GameStates.pauseMenu ){
        setState( GameStates.pauseMenu )
    } else {
        setState( GameStates.playing )
    }
    hideWebsiteOverlays()
}

function quit(){
    setState( GameStates.startMenu )
    showWebsiteOverlays()
    resetGame()
}

function setState(s){
    if( global.allGuis ) global.allGuis[global.gameState].close()
    global.gameState = s
    if( global.allGuis ) global.allGuis[global.gameState].open()
        
    
    global.shiftHeld = false
    global.controlHeld = false
}