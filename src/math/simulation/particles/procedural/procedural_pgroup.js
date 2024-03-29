// group of falling rain particles
//
// instantiated in particle_sim.js
class ProceduralPGroup extends ParticleGroup {
    
    constructor(sim,n){
        super(sim,n)
        this.lastDrawTime = 0
        this.wiggle = .05 //horizontal movement
    }
    
    *generateParticles(){
        resetRand()
        let n_particles = this.n
        let sr = this.sim.rect
        let anim_angle = this.sim.t*1e-4
        let particleRadius = this.sim.particleRadius
        let wiggle = this.wiggle
        let md2 = global.mouseGrabMd2
        global.particlesInMouseRange.clear()
        for( var i = 0 ; i < n_particles ; i++ ){
            var a = anim_angle + rand() * Math.PI*2
            var r = randRange(0,wiggle)
            var x = sr[0] + rand() * sr[2] + r*Math.cos(a * Math.floor(rand()*10))
            var yr = randRange(0,sr[3])
            var rawy = this.sim.fallSpeed*this.sim.t+yr
            var prawy = this.sim.fallSpeed*this.lastDrawTime+yr
            
            // if this particle just looped, ungrab it
            let ungrab = ( Math.floor( rawy / sr[3] ) != Math.floor( prawy / sr[3] ) )
            var y = sr[1] + nnmod( rawy, sr[3] ) //+ r*Math.sin(a)
            
            // yield one particle to possibly be drawn
            yield [i,x,y,false,ungrab]
        }
        this.lastDrawTime = this.sim.t
    }
}