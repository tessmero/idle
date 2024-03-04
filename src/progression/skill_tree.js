// costs for using tools
class SkillTree {
    
    constructor(){
        this.specs = {
            
            "basic_rain": {
                skill: new BasicRainSkill(),
                pos: [.5,.7], //position in gui
                status: "purchased",
            },
            
            "fast_rain": {
                skill: new FastRainSkill(),
                requires: "basic_rain",
                precludes: "snow",
                pos: [.3,.5], 
                status: "available",
            },
            
            "snow": {
                skill: new SnowSkill(),
                requires: "basic_rain",
                precludes: "fast_rain",
                pos: [.7,.5], 
                status: "available",
            },
            
            "fast_rain2": {
                skill: new FastRain2Skill(),
                requires: "fast_rain",
                pos: [.3,.3], 
                status: "locked",
            },
            
            "snow2": {
                skill: new Snow2Skill(),
                requires: "snow",
                pos: [.7,.3], 
                status: "locked",
            }
        }
    }
    
    isAvalable(key){
        s = this.specs[key]
        if( !s.requires ) return true
        return this.specs[s.requires].purchased
    }
}