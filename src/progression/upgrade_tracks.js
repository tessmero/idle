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
                label: 'rain amount',
                subject: ' raindrops',
                level: 1,
                maxLevel: 5,
                cost: ValueCurve.power(500,2),
                value: ValueCurve.power(100,2),
            },
            'rain speed': {
                label: 'rain speed',
                subject: ' m/s',
                level: 1,
                maxLevel: 5,
                cost: ValueCurve.power(500,2),
                value: ValueCurve.linear(100,10),
                value_conversion: v => v*3e-6, // (human readable => internal units)
            },
            'catch_radius': {
                label: 'catch radius',
                subject: '',
                level: 1,
                maxLevel: 5,
                cost: ValueCurve.power(500,2),
                value: ValueCurve.linear(100,10),
                value_conversion: v => v*.001, // (human readable => internal units)
            },
        }
    }
}