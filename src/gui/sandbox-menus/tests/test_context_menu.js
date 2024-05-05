var _testLoopSetting = null

// persistent context menu with gui sim
// that appears when a row is clicked in tests menu
class TestContextMenu extends ContextMenu {
    constructor(rect,s0,s1,test,testIndex){ 
        super(rect,s0,s1)
        this.test = test
        this.testIndex = testIndex
        
        //
        this.loopDelay = 2000
        this.loopCountdown = this.loopDelay
        
        
        // center simulation in first content square
        let sim = test.getSim()
        let tut = test.getTutorial()
        this.sim = sim
        let sdims = [sim.rect[2],sim.rect[3]]
        let c = rectCenter( ...s0 )
        let gspRect = [c[0]-sdims[0]/2, c[1]-sdims[1]/2, ...sdims]
        let gsp = new GuiSimPanel(gspRect, sim)
        gsp.loop = false
        gsp.tut = tut
        gsp.reset()
        this.gsp = gsp
        
        // divide second content square into rows
        let botRows = divideRows(...s1,10)
        let textScale = .25
        
        let duration = test.getDuration()
        this.t = 0
        this.duration = duration
        
        
        
        // add test criteria to second square
        let i = 2
        let asserts = test.getTestAssertions(sim)
        let checkTimes = []
        let checkTooltips = []
        let checkReadouts = []
        asserts.forEach( e => {
            let [time, lbl, func] = e
            let seconds = (time/1000).toFixed(1)
            let label = `${seconds}s: ${lbl}`
            let tooltip = `at ${seconds} seconds:\n${lbl}`
            checkTimes.push(time)
            checkTooltips.push(tooltip)
            checkReadouts.push(
                new StatReadout( botRows[i], uncheckedIcon, 
                    () => label)
                    .withScale(textScale)
                    .withTooltipScale(textScale)
                    .withTooltip(tooltip)
            )            
            i += 1
        })
        this.asserts = asserts
        this.checkTimes = checkTimes
        this.checkTooltips = checkTooltips
        this.checkReadouts = checkReadouts
        this.nChecks = checkTimes.length
        this.nChecksPassed = 0
        
        
        let ttDisplay = new TestTimelineDisplay( botRows[1], duration, checkTimes, checkTooltips )
        this.ttDisplay = ttDisplay
        
        let finalDisplay = new TextLabel( botRows.at(-1), '' ).withScale(.3)
        this.finalDisplay = finalDisplay
        
        
        // play/pause/etc buttons at bottom of first square
        let topRows = divideRows(...padRect(...s0,0),10)
        let controlRow = divideCols(...topRows.at(-1),10)
        let specs = [
            // icon, tooltip, action
            [prevIcon, 'previous test', ()=>this.prevClicked()],
            [playIcon, 'reset',          ()=>this.playClicked()],
            //[pauseIcon, 'pause',        ()=>{}],
            [nextIcon, 'next test',       ()=>this.nextClicked()],
            [loopIcon, 'loop (off)',      ()=>this.loopClicked()],
        ]
        let xOff = .75 *  specs.length * controlRow[0][2] // center buttons
        i = 0
        let controlButtons = specs.map( entry => {
            let [icon,tooltip,action] = entry
            let r = [...controlRow[i]]
            r[0] += xOff
            let result = new IconButton( r, icon, action )
                    .withScale(.3)
                    .withTooltip(tooltip)
                    .withTooltipScale(textScale)
            i += 1
            return result
        })
        this.loopButton = controlButtons.at(-1)
        this.updateLoopButton()
        
        let titleRect = [...topRows[0]]
        titleRect[1] -= .03
        let titleLabel = new TextLabel( titleRect, 'Test for\n'+test.getTitle() )
                .withScale(.3)
        
        this.children = this.children.concat([
            
            
            // title at top of first square
            titleLabel, 
                
            // GUi Sim Panel in middle of first square
            gsp, 
            
            // play/pause/etc buttons at bottom of first square
            ...controlButtons,
                
            // timeline at top of second square
            ttDisplay,
            
            // readouts in second square
            ...checkReadouts,
            
            // conclusion in second square
            finalDisplay,
        ])
        
    }
    
    draw(g){
        super.draw(g)
        
        // draw overlay on loop button
        if( _testLoopSetting ){
            let rect = this.loopButton.rect
            rect = padRect(...rect,-.005)
            let prg = this.loopCountdown/this.loopDelay
            ProgressIndicator._draw(g,rect,prg)
        }
    }
    
    updateLoopButton(){
        let tls = _testLoopSetting
        let tt = 'loop (off)'
        if(tls == 'single' ){
            tt = 'loop (one test)'
        }else if(tls == 'all' ){
            tt = 'loop (all tests)'
        }
        this.loopButton.withTooltip(tt)
    }
    
    loopClicked(){
        let tls = _testLoopSetting
        if(!tls){
            _testLoopSetting = 'single'
        } else if( tls == 'single' ){
            _testLoopSetting = 'all'
        } else {
            _testLoopSetting = null
        }
        this.updateLoopButton()
    }
    
    playClicked(){
        global.contextMenu = new TestContextMenu(
            ...TestContextMenu.pickRects(),
            this.test,this.testIndex)
    }
    
    prevClicked(){
        let tl = testList
        let prevIndex = nnmod(this.testIndex-1,tl.length)
        let prevTest = testList[prevIndex]
        global.contextMenu = new TestContextMenu(
            ...TestContextMenu.pickRects(),
            prevTest,prevIndex)
    }
    
    nextClicked(){
        let tl = testList
        let nextIndex = nnmod(this.testIndex+1,tl.length)
        let nextTest = testList[nextIndex]
        global.contextMenu = new TestContextMenu(
            ...TestContextMenu.pickRects(),
            nextTest,nextIndex)
    }
    
    update(dt,disableHover){        
        this.t += dt
        let hovered = super.update(dt,disableHover)
        
        let sim = this.sim
        let ttDisplay = this.ttDisplay
        
        let t = this.t
        ttDisplay.setTime(t)
        if( !this.lastTime ) this.lastTime = -1
        
        if( t>this.duration ){
            
            // finished
            let label
            if( this.nChecksPassed == this.nChecks ){
                label = 'TEST PASSED'
            } else {
                label = 'TEST FAILED'
            }
            this.finalDisplay.label = label
            
            if( _testLoopSetting ){
                this.loopCountdown -= dt
                if( this.loopCountdown < 0 ){
                    if( _testLoopSetting == 'single' ){
                        this.playClicked()
                    }else{
                        this.nextClicked()
                    }
                }
            }
            
            return hovered
        } 
        
        
        
        // iterate over checks
        for( let i = 0 ; i<this.nChecks ; i++ ){
            let [time, label, func] = this.asserts[i]
            if( (time > this.lastTime) && (time <= t) ){
                
                // perform relevent check
                let success = func()
                if( success ) this.nChecksPassed += 1
                let icon = success ? checkedIcon : trashIcon
                ttDisplay.setCheckboxIcon(i,icon)
                this.checkReadouts[i].icon = icon
                
            }
        }
        
        this.lastTime = t
        
        return hovered
    }
    
    static pickRects(){
        
        // force to right/bottom isde of screen
        return ContextMenu.pickRects(global.screenRect,v(.1,.1))
    }
}