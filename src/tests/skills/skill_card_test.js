class SkillCardTest extends Test{
    
    constructor( skill ){
        super()
        this.skill = skill
    }
    
    getDuration(){
        return Math.max( 5000, this.getTestAssertions().at(-1)[0] )
    }
    
    buildSim(){
        return this.skill.buildThumbnailSim() 
    }
}