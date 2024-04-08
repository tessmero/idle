// here we have all the logic to finally 
// add and multiply together all the bonuses from
//  - passive skills and upgrades that have been purchased
//  - temporary effects ongoing in global.mainSim
//
// finally, apply bonuses by adjusting settings in global.mainSim


function updateAllBonuses(){
    
    let upgrades = global.upgradeTracks.state
    let skills = global.skillTree.state
    
    global.mainSim.rainGroup.n = _computeBonusVal(upgrades['nparticles'])
}

// called in updateAllBonuses
// compute value and
// apply conversion if applicable (human readable -> internal units)
function _computeBonusVal(e){
    let val = e.value.f(e.level)
    if( e.value_conversion )
        val = e.value_conversion(val)
    return val
}