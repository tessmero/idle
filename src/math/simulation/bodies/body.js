// physics-enabled object that interacts with particles
class Body {
    
    // sim is a ParticleSim instance
    constructor(sim){
        this.sim = sim
    }
    
    accel(acc){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    draw(g){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    update(dt){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // called in particle_sim.js addBody()
    // this.sim has been set
    // sim param passed for convenience
    register(sim){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
    
    // called in particle_sim.js removeBody()
    // this.sim has been set
    // sim param passed for convenience
    unregister(sim){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}