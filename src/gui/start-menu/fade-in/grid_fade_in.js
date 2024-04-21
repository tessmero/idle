// black grid gradually reveals hud
class GridFadeIn extends FadeIn{
    constructor(){
        super()
        this.duration = 1000
    }
    
    // implement FadeIn 
    draw(g){
        
        g.fillStyle = global.colorScheme.fg
        
        // draw grid lines
        let sc = global.screenCorners
        let sr = global.screenRect
        let d = .1
        let [x0,y0] = sc[0].xy()
        let [x1,y1] = sc[2].xy()
        let maxoff = .5
        let lw = ((this.duration-this.t)/(this.duration*(1-maxoff))) * d
        maxoff *= d
        for( let x = x0 ; x < x1 ; x += d ){
            let mylw = Math.max(0,lw-maxoff*(x1-x)/(x1-x0))
            g.fillRect(x-mylw/2,sr[1],mylw,sr[3])
        }
        for( let y = y0 ; y < y1 ; y += d ){
            let mylw = Math.max(0,lw-maxoff*(y1-y)/(y1-y0))
            g.fillRect(sr[0],y-mylw/2,sr[2],mylw)
        }
    }
}