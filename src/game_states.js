const GameStates = {
    startMenu: 0,
    playing: 1,
    statsMenu: 2,
    pauseMenu: 3,
}

function rebuildGuis(){
    global.allGuis = {
        0: new StartMenu(),
        1: new Hud(),
        2: new StatsMenu(),
        3: new PauseMenu(),
    }
}

function resume(){
    global.selectedToolIndex = 0
    global.gameState = GameStates.playing
    document.getElementById("navbar").style.display = "none";
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

function stats(){
    
    global.selectedToolIndex = 0
    global.gameState = GameStates.statsMenu
    document.getElementById("navbar").style.display = "none";
}

function pause(){
    global.selectedToolIndex = 0
    global.gameState = GameStates.pauseMenu
    document.getElementById("navbar").style.display = "none";
}

function quit(){
    global.selectedToolIndex = 0
    global.gameState = GameStates.startMenu
    document.getElementById("navbar").style.display = "block";
    resetGame()
}