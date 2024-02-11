const GameStates = {
    startMenu: 0,
    playing: 1,
    upgradeMenu: 2,
    pauseMenu: 3,
}

function rebuildGuis(){
    global.allGuis = [
         new StartMenu(),
         new Hud(),
         new UpgradeMenu(),
         new PauseMenu(),
    ]
    global.allGuis.forEach(k => {
        k.clickableElements = k.buildElements()
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
        setState( GameStates.upgradeMenu )
    } else {
        setState( GameStates.playing )
    }
    
}

// go from pause menu back to game
function resume(){
    setState( GameStates.playing )
    hideWebsiteOverlays()
}

function play(){
    
    // reset progress
    global.nParticles = 100
    global.particlesCollected = 0
    global.allPois = []
    global.grabbedParticles = new Set()
    global.activeReleasePatterns = []
    
    resume()
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
    global.selectedToolIndex = 0
    if( global.allGuis ) global.allGuis[global.gameState].close()
    global.gameState = s
    if( global.allGuis ) global.allGuis[global.gameState].open()
        
    
    global.shiftHeld = false
    global.controlHeld = false
}