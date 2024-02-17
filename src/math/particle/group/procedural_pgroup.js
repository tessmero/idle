// group of falling rain particles
class ProceduralPGroup extends ParticleGroup {
    
    constructor(){
        super()
        this.lastDrawTime = 0
    }
    
    *generateParticles(){
        resetRand()
        let n_particles = global.nParticles
        let sc = global.screenCorners
        let sr = global.screenRect
        let anim_angle = global.t*1e-4
        let particle_radius = global.particle_radius
        let particle_wiggle = global.particle_wiggle
        let md2 = global.mouseGrabMd2
        global.particlesInMouseRange.clear()
        for( var i = 0 ; i < n_particles ; i++ ){
            var a = anim_angle + rand() * Math.PI*2
            var r = randRange(0,particle_wiggle)
            var x = sr[0] + rand() * sr[2] + r*Math.cos(a * Math.floor(rand()*10))
            var yr = randRange(0,sr[3])
            var rawy = global.fallSpeed*global.t+yr
            var prawy = global.fallSpeed*this.lastDrawTime+yr
            
            // if this particle just looped, ungrab it
            let ungrab = ( Math.floor( rawy / sr[3] ) != Math.floor( prawy / sr[3] ) )
            var y = sr[1] + nnmod( rawy, sr[3] ) //+ r*Math.sin(a)
            
            // yield one particle to possibly be drawn
            yield [x,y,ungrab]
        }
        this.lastDrawTime = global.t
    }
}