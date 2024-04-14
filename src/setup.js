

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
    // calls resetGame() defined further down
    global.mainSim = new MainPSim()
    quit()
    
    //////////////////////////////////////////
    // unit tests 20240414
    if( false ){
        
        // start sim unit tests
        let sim = global.mainSim
        console.assert( sim.allBodies.size == 3 ) // 3 bodies in start menu 
        
        // test clearBodies
        function assertClear(){
            console.assert( sim.allBodies.size == 0 )
            console.assert( sim.grabbers.size == 0 )
            console.assert( sim.edgeGroup.subgroups.size == 0 )
            
            // expect one leftover group
            console.assert( sim.physicsGroup.subgroups.size == 1 )
        }
        sim.clearBodies()
        assertClear()
        
        // test Body implementations
        let testedCount = 0
        function check(b){
            sim.addBody(b)
            sim.removeBody(b)
            assertClear()
            testedCount += 1
        }
        check(new CircleBody(sim,v(.5,.5),.1))
        check(new ControlledCircleBody(sim,v(.5,.5),.1))
        check(new CollectorCircleBody(sim,v(.5,.5),.1))
        check(new SausageBody(sim,v(.5,.5),v(.3,.3)))
        check(new ControlledSausageBody(sim,v(.5,.5),v(.3,.3)))
        check(new StarBody(sim,v(.5,.5),5,.05,.1))
        check(new ControlledStarBody(sim,v(.5,.5),5,.05,.1))
        console.log(`${testedCount} Body subclasses passed tests`)
        
        
    } else {
    
        // start game
        requestAnimationFrame(gameLoop);
    }
}

function resetGame(){
    
    // init start menu background sim
    global.t = 0
    global.mainSim.particlesCollected = 0
    
    
    global.activeReleasePatterns = []
    
    global.startMenuTargetPos = v(.5,.5)
    global.mainSim.clearBodies()

    let s = global.mainSim
    global.toolList = [
        new DefaultTool(s,global.mouseGrabRadius),
        new CircleTool(s),
        new LineTool(s),
    ]
    
    // reset progression
    global.upgradeTracks = new UpgradeTracks()
    global.skillTree = new SkillTree()
    updateAllBonuses()
    global.mainSim.rainGroup.n = 2000
    
    let poi = new ControlledCircleBody(global.mainSim,v(0,0),Math.sqrt(global.poiStartArea))
    global.mainSim.addBody(poi)
    
    let star = new ControlledStarBody(global.mainSim,v(.75,.45),5,.05,.1)
    global.mainSim.addBody(star)
    
    let lines = [
        //[v(.65,.55),v(.85,.35)],
        [v(1-.65,.55),v(1-.75,.35)]
    ]
    lines.forEach(l => global.mainSim.addBody(new ControlledSausageBody(global.mainSim,...l)))
    
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

