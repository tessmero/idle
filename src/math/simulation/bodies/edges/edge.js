// base class for edges which map angles to positions
class Edge {
    getPos(a){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    getNorm(a){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    getCircumference(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // settings for particles sliding on edge
    getF(){ throw new Error(`Method not implemented in ${this.constructor.name}.`); }
    getG(){ throw new Error(`Method not implemented in ${this.constructor.name}.`); }
    
    // debug
    drawNormals(g){
        this._drawDebugVectors(g, a => {
            let r = 1e-2
            let pos = this.getPos(a)
            let norm = this.getNorm(a)
            return[ pos, pos.add(vp(norm,r)) ]
        })
    }
    
    // debug
    drawAccel(g,epsg){
        this._drawDebugVectors(g, a => {
            let pos = this.getPos(a)
            let acc = epsg.getAccel(a)
            return[ pos, pos.add(acc.mul(5e2)) ]
        })
    }
    
    _drawDebugVectors(g,f){
        
        if( !this.terminals )
            this.terminals = [0,1]
        let t = this.terminals
        
        let density = 100 // ~lines per screen length
        let n = this.getCircumference()*density
        g.strokeStyle = 'yellow'
        g.beginPath()
        for( let i = 0 ; i < n ; i++ ){
            let a = avg(t[0],t[1],i/n)
            let [start,stop] = f(a)
            g.moveTo(...start.xy())
            g.lineTo(...stop.xy())
        }
        g.stroke()
        g.strokeStyle = global.lineColor
    }
}