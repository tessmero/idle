// progression tree for purchasable skills
//
// specify tree in constructor
//
// persistant instance global.skillTree
//   contains state of purchased skills for the current game


class SkillTree {
    
    constructor(){
        this.state = {
            "basic_circle": {
                skill: new BasicCircleSkill(),
                pos: [.35,.7], //position in gui
                status: "purchased",
            },
            
            "bouncy_circle": {
                skill: new BouncyCircleSkill(),
                requires: "basic_circle",
                pos: [.35,.5], 
                status: "available",
            },
            
            "basic_line": {
                skill: new BasicLineSkill(),
                pos: [.65,.7], 
                status: "purchased",
            },
            
            "flipper_line": {
                skill: new FlipperLineSkill(),
                requires: "basic_line",
                pos: [.65,.5], 
                status: "available",
            },
            
            /*
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
            */
        }
    }
    
    isAvalable(key){
        s = this.specs[key]
        if( !s.requires ) return true
        return this.specs[s.requires].purchased
    }
}