

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
    global.floaters = new FloaterGroup(100)
    quit()
    
    //////////////////////////////////////////
    // unit tests 20240505
    if( false ){
        
        // start sim unit tests
        let sim = global.mainSim
        console.assert( sim._bodies.size == 3 ) // 3 bodies in start menu 
        
        // test clearBodies
        function assertClear(){
            console.assert( sim._bodies.size == 0 )
            console.assert( sim._grabbers.size == 0 )
            console.assert( sim.edgeGroup.subgroups.size == 0 )
            
            // expect one leftover group
            console.assert( sim.physicsGroup.subgroups.size == 1 )
        }
        sim.clearBodies()
        assertClear()
        
        // test Body implementations
        let testedBodies = 0
        function testBody(b){
            sim.addBody(b)
            sim.removeBody(b)
            assertClear()
            testedBodies += 1
        }
        testBody(new CircleBody(sim,v(.5,.5),.1))
        testBody(new ControlledCircleBody(sim,v(.5,.5),.1))
        testBody(new CircleBuddy(sim,v(.5,.5),.1))
        testBody(new SausageBody(sim,v(.5,.5),v(.3,.3)))
        testBody(new ControlledSausageBody(sim,v(.5,.5),v(.3,.3)))
        testBody(new StarBody(sim,v(.5,.5),5,.05,.1))
        testBody(new ControlledStarBody(sim,v(.5,.5),5,.05,.1))
        testBody(new CrossBody(sim,v(.5,.5),5,.05,.1))
        testBody(new ControlledCrossBody(sim,v(.5,.5),5,.05,.1))
        testBody(new CompassBody(sim,v(.5,.5),5,.05,.1))
        testBody(new ControlledCompassBody(sim,v(.5,.5),5,.05,.1))
        console.log(`${testedBodies} Body subclasses passed tests`)
        
        // test tool implementations
        
        let testedTools = 0
        function testTool(t){            
        
            // emulate input fluke 
            // (no mouse up event)
            t.mouseDown(v(.5,.5))
            t.unregister(sim)
            
            // make sure nothing leaked
            assertClear()
            
            testedTools += 1
        }
        testTool(new CircleTool(sim))
        testTool(new DefaultTool(sim,.1))
        testTool(new LineTool(sim))
        testTool(new PiTool(sim,.1))
        console.log(`${testedTools} Tool subclasses passed tests`)
        
        
        // specific test for default tool
        let t = new DefaultTool(sim,.1)
        t.mouseDown(v(.5,.5))
        console.assert( sim._grabbers.size == 1 )
        t.mouseUp(v(.5,.5))
        console.assert( sim._grabbers.size == 0 )
            
        
    } else {
    
        // start game
        requestAnimationFrame(gameLoop);
    }
}


function setColorScheme(cs){
    global.colorScheme = cs
    
    // set html elem background property
    // needed for palette-flip effect
    document.getElementById("gameCanvas").style.backgroundColor = global.colorScheme.bg
}

function resetGame(){
    setColorScheme( ColorScheme.default )
    
    // init start menu background sim
    global.t = 0
    let gms = global.mainSim
    gms.particlesCollected = 0
    
    
    global.activeReleasePatterns = []
    
    global.startMenuTargetPos = v(.5,.5)
    gms.clearBodies()

    
    resetProgression()
    gms.rainGroup.n = 2000
    
    //let poi = new ControlledCircleBody(gms,v(.5,.3),Math.sqrt(global.poiStartArea))
    //gms.addBody(poi)
    
    let cross = new ControlledCrossBody(gms,v(.5,.45),5,.05,.1)
    gms.addBody(cross)
    
    let comp = new ControlledCompassBody(gms,v(.15,.45),5,.05,.1)
    gms.addBody(comp)
    
    let star = new ControlledStarBody(gms,v(.85,.45),5,.05,.1)
    gms.addBody(star)
    
    
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

