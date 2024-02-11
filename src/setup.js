

// Initialize the game
function init() {
    
    var cvs = document.getElementById("gameCanvas");
      cvs.style.width='100%';
      cvs.style.height='100%';  
    cvs.addEventListener("mousemove", function(e){global.debug='MM',global.dminput||mouseMove(e)});
    cvs.addEventListener("mousedown", function(e){global.debug='MD',global.dminput||mouseDown(e)});
    cvs.addEventListener("mouseup", function(e){global.debug='MU',global.dminput||mouseUp(e)});
    cvs.addEventListener("touchstart", function(e){global.dminput=true,global.debug='TS',mouseDown(e)}, false);
    cvs.addEventListener('touchend', function(e){global.dminput=true,global.debug='TE',mouseUp(e)}, false );
    cvs.addEventListener('touchcancel', function(e){global.dminput=true,global.debug='TC',mouseUp(e)}, false );
    
    // https://stackoverflow.com/a/63469884
    var previousTouch;
    cvs.addEventListener("touchmove", (e) => {
        global.debug = 'TM'
        const touch = e.touches[0];
        mouseMove({
            clientX: touch.pageX,
            clientY: touch.pageY
        })
        e.preventDefault()
    });
    
    document.addEventListener("keydown", keyDown )
    document.addEventListener("keyup", keyUp )
    
    document.querySelector('body').addEventListener('contextmenu', (event) => {
      event.preventDefault();
    })
    global.canvas = cvs
    global.ctx = cvs.getContext("2d");
    
    // go to start menu
    quit()
    
    //
    requestAnimationFrame(gameLoop);
}

function resetGame(){
    
    // init start menu background sim
    global.nParticles = 1000
    global.particlesCollected = 0
    global.grabbedParticles = new Set()
    global.allPois = []
    global.activeReleasePatterns = []
    
    
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

