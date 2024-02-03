
class StatsMenu extends Gui {
    
    // implement gui
    buildElements(){
        let sc = global.screenCorners
        let m = .4
        let bigCenterRect = [sc[0].x+m,sc[0].y+m, (sc[2].x-sc[0].x)-2*m, (sc[2].y-sc[0].y)-2*m]
        return [
            new TextButton(bigCenterRect,'STATS',toggleStats)//game_states.js
        ]
    }
}
