
class Hud extends Gui {
    
    // implement gui
    buildElements(){
        let sc = global.screenCorners
        let m = .1
        let topRow = [sc[0].x,sc[0].y, (sc[2].x-sc[0].x), .1]
        let topRect = [sc[0].x+m,sc[0].y+m, .5*(sc[2].x-sc[0].x)-2*m, .5*(sc[2].y-sc[0].y)-5*m]
        return [
            {
                // pause button
                rect: topRow,
                draw: g => this.drawButton(g,topRow,'PAUSE'), //gui.js
                click: pause, //game_states.js
            }
        ]
    }
}