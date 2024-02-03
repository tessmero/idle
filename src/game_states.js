const GameStates = {
    startMenu: 0,
    playing: 1,
    statsMenu: 2,
    pauseMenu: 3,
}

function rebuildGuis(){
    if( !global.allGuis ){
        global.allGuis = [
             new StartMenu(),
             new Hud(),
             new StatsMenu(),
             new PauseMenu(),
        ]
    }
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
    if( global.gameState != GameStates.statsMenu ){
        global.selectedToolIndex = 0
        global.gameState = GameStates.statsMenu
    } else {
        global.selectedToolIndex = 0
        global.gameState = GameStates.playing
    }
    
}

// go from pause menu back to game
function resume(){
    global.selectedToolIndex = 0
    global.gameState = GameStates.playing
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
    global.selectedToolIndex = 0
    global.gameState = GameStates.pauseMenu
    hideWebsiteOverlays()
}

function quit(){
    global.selectedToolIndex = 0
    global.gameState = GameStates.startMenu
    showWebsiteOverlays()
    resetGame()
}