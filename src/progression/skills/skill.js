// a purchasable skill that appears in the upgrades/skills menu
const _allPreviewSims = {}
class Skill {
    
    constructor(name){
        this.name = name
    }

    // called in gui/upgrade_menu/skill_tab.js
    getPreviewSim(){
        let clazz = this.constructor.name
        if(!( clazz in _allPreviewSims )){
            _allPreviewSims[clazz] = this.buildPreviewSim()
        }
        return _allPreviewSims[clazz]
    }

    // should only be called in getPreviewSim() ^
    buildPreviewSim(){
        throw new Error(`Method not implemented in ${this.constructor.name}.`);
    }
}