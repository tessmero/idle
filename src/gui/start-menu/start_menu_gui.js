
class StartMenuGui extends Gui {
    
    constructor(){
        super()
    }
    
    // implement gui
    buildElements(){
        let sc = global.screenCorners
        let sr = global.screenRect
        let m = .3
        
        let specs = randChoice([
            [
                [2,'IDLE RAIN'],
                [3,'CATCHER']
            ],
            [
                [2,'RAIN CATCHER']  
            ],
            [
                [2,'RAIN'],
                [3,'CATCHER'],
                [4,'IDLE']
            ],
        ])
        
        // layout a column of wide buttons in the middle of the screen
        let dims = getTextDims('IDLERAINNN')
        let pad = .005
        let w = dims[0] + pad*10
        let h = .1
        let n = 10
        let th = h*n + pad*(n-1)
        let x = sr[0]+sr[2]/2-w/2
        let y = .01 + sr[1]+sr[3]/2-th/2
        let slots = []
        for( let i = 0 ; i < n ; i++ )
            slots.push([x,y+i*(h+pad),w,h])
        this.slots = slots
        
        let textPad = .01 // padding around letters' pixels
        
        this.labels = specs.map( s => {
            return new TextLabel(slots[s[0]],s[1]).withLetterPixelPad(textPad).withStyle('hud')
        })
        
        // rect to contain start and sandbox buttons
        let brect = padRect(...slots[7],.01)
        let buttonPad = .02 // space between buttons
        let s = brect[3]
        let playRect = [brect[0],brect[1],brect[2]-s-buttonPad,brect[3]]
        let sandboxRect = [brect[0]+brect[2]-s,brect[1],s,s]
        
        return [
            ...this.labels,
            new TextButton(playRect,'PLAY',playClicked),  //game_state.js
            new IconButton(sandboxRect,sandboxIcon,sandboxClicked),  //game_state.js
        ]
    }
}