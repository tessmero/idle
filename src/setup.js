

// Initialize the game
function init() {
    
    var cvs = document.getElementById("gameCanvas");
      cvs.style.width='100%';
      cvs.style.height='100%';  
    cvs.addEventListener("mousemove", mouseMove);
    cvs.addEventListener("mousedown", mouseDown);
    cvs.addEventListener("mouseup", mouseUp);
    cvs.addEventListener("touchstart", mouseDown, false);
    cvs.addEventListener("touchend", mouseUp, false);
    document.addEventListener("keydown", keyDown )
    
    global.canvas = cvs
    global.ctx = cvs.getContext("2d");
    
    // go to start menu
    quit()
    
    //
    requestAnimationFrame(gameLoop);
}

function resetGame(){
    
    global.nParticles = 1000
    global.particlesCollected = 0
    global.grabbedParticles = new Set()
    global.allPois = []
    resetRand(hard = true)
    fitToContainer()   
}


// Main game loop
let secondsPassed;
let oldTimeStamp;
let fps;

function gameLoop(timeStamp) {
    
    var msPassed = 0;
    if (oldTimeStamp) {
      msPassed = timeStamp - oldTimeStamp;
    }
    var secondsPassed = msPassed / 1000;
    oldTimeStamp = timeStamp;
    var fps = Math.round(1 / secondsPassed);


    msPassed = Math.min(msPassed,50)

    update(msPassed);
    draw(fps);

    requestAnimationFrame(gameLoop);
}


// Initialize the game
init();

