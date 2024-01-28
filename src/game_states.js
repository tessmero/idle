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

function play(){
    global.selectedToolIndex = 0
    global.gameState = GameStates.playing
    document.getElementById("navbar").style.display = "none";
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
}