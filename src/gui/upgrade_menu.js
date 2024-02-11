
class UpgradeMenu extends Gui {
    
    constructor(...p){
        super(...p)
        
        // prepare for tiled transition effect
        let sc = global.screenCorners
        let sr = global.screenRect
        let m = .1
        m = .05
        let bigCenterRect = [sc[0].x+m,sc[0].y+m, (sc[2].x-sc[0].x)-2*m, (sc[2].y-sc[0].y)-2*m]
        
        this.transitionRect = sr//bigCenterRect
        this.transitionTileSize = 10*global.textPixelSize
        let tr = this.transitionRect
        let ts = this.transitionTileSize
        let w = Math.ceil(tr[2]/ts)
        let h = Math.ceil(tr[3]/ts)
        let n = w*h
        this.transitionEffect = new Array(n).fill(false)
        
        this.maxTransitionRadius = sc[0].sub(sc[2]).getMagnitude()
        this.transitionSpeed = 6e-3 // radius increase per ms
        this.transitionCenter = v(.5,.5)//state
        this.transitionRadius = 0//state
        
        this.hasHudInBackground = true // checked in draw.js
    }
    
    // extend Hud
    buildElements(){
        
        let sc = global.screenCorners
        let sr = global.screenRect
        let m = .1*sr[2]
        let w = sr[2]-2*m
        let h = .1 
        let r0 = [sc[0].x+m,sc[0].y+m, w,h]
        let result = [
                
            // particles on screen
            new AdjustableGlobalVar(r0,"fallSpeed",3e-6)
                .withTooltip('rain fall speed'),
            
        ]
        
        let specs = [
            // variable names in global.js
            ['fallSpeed',3e-6 , 'rain fall speed'],
            ['particle_radius',.001, 'size of falling rain drops'],
            ['particle_wiggle',.01, 'horizontal movement of falling rain'],
            ['poiFriction',1e-3, 'circle friction'],
        ]
        specs.forEach( row => {
            result.push(new AdjustableGlobalVar(
                r0,row[0],row[1]) // rect, varname, increment,
                .withTooltip(row[2])) // toolsip
            r0 = [...r0]
            r0[1] += h
        })
        
        return result
        
    }
    
    //extend gui
    draw(g){
        super.draw(g)
    }
    
    open(){
        // restart transition animation
        this.transitionRadius = 0
    }
    
    close(){
        // restart transition animation
        this.transitionRadius = 0
    }
    
    //called in update.js
    updateTransitionEffect(dt){
        
        // advance transition radius if necessary
        if( this.transitionRadius < this.maxTransitionRadius ){
            this.transitionRadius += dt*this.transitionSpeed
            
            // check if the upgrade menu is open
            let tval = (global.allGuis && (global.allGuis[global.gameState]==this))
            
            // set transition effect within radius
            let md2 = Math.pow(this.transitionRadius,2)
            let tc = this.transitionCenter
            let tr = this.transitionRect
            let ts = this.transitionTileSize
            let w = Math.ceil(tr[2]/ts)
            let h = Math.ceil(tr[3]/ts)
            for( let x = 0 ; x < w ; x++ ){
                for( let y = 0 ; y < h ; y++ ){
                    let dx = tc.x - (tr[0]+x*ts)
                    let dy = tc.y - (tr[1]+y*ts)
                    if( (dx*dx+dy*dy) < md2 )
                        this.transitionEffect[x*h+y] = tval
                }
            }
        }
    }
    
    // called in draw.js
    drawTransitionEffect(g){
        
        // invert colors for center rectangle
        let tr = this.transitionRect
        let ts = this.transitionTileSize
        let w = Math.ceil(tr[2]/ts)
        let h = Math.ceil(tr[3]/ts)
        g.globalCompositeOperation = "xor";
        g.fillStyle = 'black'
        
        for( let x = 0 ; x < w ; x++ ){
            for( let y = 0 ; y < h ; y++ ){
                if( this.transitionEffect[x*h+y] ){
                    g.fillRect(tr[0]+x*ts,tr[1]+y*ts,ts,ts)
                }
            }
        }
        
        
        g.globalCompositeOperation = "source-over";
        
    }
}
