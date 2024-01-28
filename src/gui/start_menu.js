
class StartMenu extends Gui {
    
    // implement gui
    buildElements(){
        let sc = global.screenCorners
        let m = .3
        let bigCenterRect = [sc[0].x+m,sc[0].y+m, (sc[2].x-sc[0].x)-2*m, (sc[2].y-sc[0].y)-2*m]
        return [
            {
                // start button
                rect: bigCenterRect,
                 draw: g => this.drawButton(g,bigCenterRect,'PLAY'),//gui.js
                click: play, //game_state.js
            }
        ]
    }
}