// progression tree for purchasable upgrades
//
// specify tree in constructor
//
// persistant instance global.upgradeTracks
//   contains state of purchased upgrades for the current game

class UpgradeTracks {
    
    constructor(){
        this.state = {
            'nparticles': {
                level: 0,
                cost: ValueCurve.power(500,2),
                value: ValueCurve.power(100,2),
            },
            'catch_radius': {
                level: 0,
                cost: ValueCurve.power(500,2),
                value: ValueCurve.linear(100,10),
                value_conversion: v => v*.001, // (human readable => internal units)
            },
            'fall_speed': {
                level: 0,
                cost: ValueCurve.power(500,2),
                value: ValueCurve.linear(100,10),
                value_conversion: v => v*3e-6, // (human readable => internal units)
            },
        }
    }
}