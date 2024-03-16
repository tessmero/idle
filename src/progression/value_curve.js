class ValueCurve {

    // f(i) => value after i upgrades
    constructor(f){
        this.f = f
    }

    static linear(m,b){ return new ValueCurve(
        i => m*i + b
    )}
        
    static power(start,scale){ return new ValueCurve(
        i => start * Math.pow(i,scale)
    ) }
}