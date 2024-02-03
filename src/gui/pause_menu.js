
class PauseMenu extends Gui {
    
    // implement Gui
    buildElements(){
        let sc = global.screenCorners
        let sr = global.screenRect
        
        // layout a column of wide buttons in the middle of the screen
        let pad = .005
        let w = .4
        let h = .1
        let n = 4
        let th = h*n + pad*(n-1)
        let x = sr[0]+sr[2]/2-w/2
        let y = sr[1]+sr[3]/2-th/2
        let slots = []
        for( let i = 0 ; i < n ; i++ )
            slots.push([x,y+i*(h+pad),w,h])
        
        
        return [
            new TextButton(slots[0],'RESUME',resume),//game_states.js
            new TextButton(slots[2],'QUIT',quit)//game_states.js
        ]
    }
}
