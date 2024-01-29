
class StartMenu extends Gui {
    
    constructor(){
        super()
            
        
        this.rainIcon = [
            'W   W',
            '  W  ',
            'W   W',
            '  W  ',
            'W   W',
        ]
        
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
        
        return [
            {
                // message banner
                rect: null,
                draw: g => this.drawLabel(g,slots[2],message),//gui.js
                click: null, //game_states.js
            }, 
            {
                // message banner
                rect: null,
                draw: g => this.drawLabel(g,slots[3],'TO CATCH RAIN'),//gui.js
                click: null, //game_states.js
            }, 
            {
                // start button
                rect: slots[8],
                draw: g => {
                    if( global.particlesCollected>global.particlesRequiredToStart ) this.drawButton(g,slots[8],'PLAY')
                },//gui.js
                click: () => {
                    if( global.particlesCollected>global.particlesRequiredToStart ) play() //game_state.js
                    else return true
                }
            }
        ]
    }
}