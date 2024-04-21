// here we have all the logic to finally 
// add and multiply together all the bonuses from
//  - passive skills and upgrades that have been purchased
//  - temporary effects ongoing in global.mainSim
//
// finally, apply bonuses by adjusting settings in global.mainSim


function updateAllBonuses(){
    
    if( global.upgradeTracks ){
    
    
        // compute+apply each bonus, and build summary
        let specs = [
            ['nparticles',val => 
                global.mainSim.rainGroup.n = val
            ],
                
            ['rain_speed',val => 
                global.mainSim.fallSpeed = val
            ],
                
            ['catch_radius',val => 
                global.toolList[0].rad = val
            ],
        ]
        global.bonusSummary = specs.map( entry => _updateBonus(...entry) )
        
    }
    
    
    
    if( global.screenRect )
        rebuildGuis()
}

function _updateBonus(key,f){
    
    // compute bonus
    let upgrades = global.upgradeTracks.state
    let e = upgrades[key]
    let [readableVal,realVal] = _computeBonusVal(e)
    
    // explain in words
    let summary = `base ${readableVal}${e.subject}\n  (upgrade level ${e.level})`
    
    // enact bonus
    f(realVal)
    
    return [e.icon,summary]
}

// called in updateAllBonuses
// compute value and
// apply conversion if applicable (human readable -> internal units)
function _computeBonusVal(e){
    let readableVal = e.value.f(e.level-1)
    let realVal = readableVal
    if( e.value_conversion )
        realVal = e.value_conversion(readableVal)
    return [readableVal,realVal]
}