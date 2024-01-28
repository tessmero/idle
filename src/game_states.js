const GameStates = {
    startMenu: 0,
    playing: 1,
    pauseMenu: 2,
}

function rebuildGuis(){
    global.allGuis = {
        0: new StartMenu(),
        1: new Hud(),
        2: new PauseMenu(),
    }
}

function play(){
    global.gameState = GameStates.playing
    document.getElementById("navbar").style.display = "none";
}

function pause(){
    global.gameState = GameStates.pauseMenu
    document.getElementById("navbar").style.display = "none";
}

function quit(){
    global.gameState = GameStates.startMenu
    document.getElementById("navbar").style.display = "block";
}