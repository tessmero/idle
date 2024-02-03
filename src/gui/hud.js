
class Hud extends Gui {
    
    constructor(){
        super()
        
        this.pauseIcon = [
            'ww ww',
            'ww ww',
            'ww ww',
            'ww ww',
            'ww ww'
        ]
        
        this.collectedIcon = [
            'WWWWW',
            'W   W',
            'WWWWW',
            'WWWWW',
            'WWWWW',
        ]
        
        this.rainIcon = [
            'W   W',
            '  W  ',
            'W   W',
            '  W  ',
            'W   W',
        ]
        
        this.catchIcon = [
            'W   W',
            'W WWW',
            'WWWWW',
            ' WWW ',
            ' WWW ',
        ]
        
        this.statsIcon = [
            'W WWW',
            '     ',
            'W WWW',
            '     ',
            'W WWW',
        ]
    }
    
    // implement gui
    buildElements(){
        let sc = global.screenCorners
        let sr = global.screenRect
        let m = .1
        
        // layout buttons at top of screen
        let topRow = [sc[0].x,sc[0].y, (sc[2].x-sc[0].x), m]
        let topLeft = [sr[0],sr[1],m,m]
        let topRight = [sc[2].x-m,sr[1],m,m]
        let topClp = [sr[0]+sr[2]*.1,sr[1]+m/4]
        let topCenterP = [sr[0]+sr[2]*.4,topClp[1]]
        let topCrp = [sr[0]+sr[2]*.7,topClp[1]]
        
        // layout toolbar at bottom of screen
        let mx = .2
        let nbuttons = toolList.length
        let padding = .005
        let buttonWidth = m-padding*2
        let rowHeight = buttonWidth + padding*2
        let rowWidth = buttonWidth*nbuttons + padding*(nbuttons+1)
        let brow = [sr[0]+sr[2]/2-rowWidth/2,sr[1]+sr[3]-rowHeight, rowWidth, rowHeight]
        let slots = []
        for( let i = 0 ; i < nbuttons ; i++ ){
            slots.push([brow[0]+padding+i*(buttonWidth+padding),brow[1]+padding,buttonWidth,buttonWidth])
        }
        
        
        // build top hud
        let result = [
        
            // stats button
            new IconButton(topLeft,this.statsIcon,toggleStats), //game_state.js
            
            // particles on screen
            new StatReadout(topClp,this.rainIcon,() => 
                global.nParticles.toString()),
            
            // catch rate %
            new StatReadout(topCenterP,this.catchIcon,() => 
                Math.floor(100*(global.grabbedParticles.size/global.nParticles)).toString()+'%'),
                
            // total caught
            new StatReadout(topCrp,this.collectedIcon,() => 
                global.particlesCollected.toString()),
            
            // pause button
            new IconButton(topRight,this.pauseIcon,pause), //game_state.js
        ]
        
        
        // build toolbar buttons
        for( let i = 0 ; i < toolList.length ; i++ ){
            result.push(
                new ToolbarButton(slots[i],toolList[i].iconLayout,i)
            )
        }
        
        return result
    }
}