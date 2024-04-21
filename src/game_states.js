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
    let money = 0
    let s = global.mainSim
    global.toolList = [
        new DefaultTool(s,global.mouseGrabRadius),
        new CircleTool(s),
        new LineTool(s),
    ]
    
    if( global.sandboxMode ){
        money = 1e100
        global.toolList.push(
            new PiTool(s,global.mouseGrabRadius)
        )
    }
    
    global.mainSim.setTool(global.toolList[0])
    global.mainSim.rainGroup.n = 100
    
    global.mainSim.particlesCollected = money
    
    if( !global.sandboxMode ){
        
        // remove bodies from start menu sim
        global.mainSim.clearBodies()
        global.mainSim.rainGroup.grabbedParticles.clear()
    }
    global.upgradeTracks = new UpgradeTracks()
    global.skillTree = new SkillTree()
    updateAllBonuses()
}

// user clicked play button on start menu
function playClicked(){
    global.sandboxMode = false
    
    // show full start transition
    hideWebsiteOverlays()
    setState( GameStates.startTransition )
}

// user clicked sandbox button on start menu
function sandboxClicked(){
    let skipTransition = true

    global.sandboxMode = true
    hideWebsiteOverlays()
    
    if( skipTransition ){
        
        // skip transition
        setColorScheme(ColorScheme.sandbox)//setup.js
        play()
        
    } else {
        
        // do short transition
        setState( GameStates.startTransition )
    }
}

// called in start_transition_gui.js
function startTransitionFinished(){
    play()
}

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