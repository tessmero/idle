class TutorialTest extends Test{
    
    constructor(tut){
        super()
        this.tut = tut
    }
    
    buildSim(){
        return this.tut.buildSim()
    }
    
    getTutorial(){
        return this.tut
    }
    
    getTitle(){
        return this.tut.getTitle()
    }
    
    getDuration(){
        return Math.max( 
            super.getDuration(), // duration for test assertions
            this.tut.getDuration() ) // duration for tutorial animation
    }
}