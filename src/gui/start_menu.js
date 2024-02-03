
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
            new TextLabel(slots[2],message),
            new TextLabel(slots[3],'TO CATCH RAIN'),
            new TextButton(slots[8],'PLAY',play),  //game_state.js
        ]
    }
}