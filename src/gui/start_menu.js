
class StartMenu extends Gui {
    
    constructor(){
        super()
    }
    
    // implement gui
    buildElements(){
        let sc = global.screenCorners
        let sr = global.screenRect
        let m = .3
        
        // layout a column of wide buttons in the middle of the screen
        let message = 'PRESS AND DRAG'
        let dims = getTextDims(message)
        let pad = .005
        let w = dims[0] + pad*10
        let h = .1
        let n = 10
        let th = h*n + pad*(n-1)
        let x = sr[0]+sr[2]/2-w/2
        let y = sr[1]+sr[3]/2-th/2
        let slots = []
        for( let i = 0 ; i < n ; i++ )
            slots.push([x,y+i*(h+pad),w,h])
        this.slots = slots
        
        let textPad = .01 // padding around letters' pixels
        
        this.labels = [
            new TextLabel(slots[2],message).withPad(textPad),
            new TextLabel(slots[3],'TO CATCH RAIN').withPad(textPad),
        ]
        
        return [
            ...this.labels,
            new TextButton(slots[8],'PLAY',play),  //game_state.js
        ]
    }
    
    draw(g){
        
        // update label position
        if( this.slots && this.labels ){
            
            // use slots as center position
            let x = this.slots[0][0] + .1*Math.sin(global.t/1e3)
            this.labels.forEach(l => l.rect[0]=x)
        }
        
        super.draw(g)
    }
}