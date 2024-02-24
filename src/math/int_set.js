// a wrapper for a set of small integers 
// and corresponding boolean array
class IntSet{
    constructor(n,fill=false){
        this.n = n
        this.bools = new Array(n).fill(fill) 
        
        this.set = new Set()
        if(fill)
            for(let i = 0 ; i < n ; i++ )
                this.set.add(i)
    }
    
    // get number of true elements
    size(){ 
        return this.set.size
    }
    
    // get first index matching b
    find(b){
        for(let i = 0 ; i < this.n ; i++ ){
            if( this.bools[i] == b ) return i
        }
        return -1
    }
    
    clear(){ this.fill(false) }
    
    has(i){
        return this.bools[i]
    }
    
    fill(b){
        for(let i = 0 ; i < this.n ; i++ ){
            if( b ){
                this.add(i)
            } else {
                this.delete(i)
            }
        }
    }
    
    add(i){
        this.bools[i] = true
        this.set.add(i)
    }
    
    delete(i){
        this.bools[i] = false
        this.set.delete(i)
    }
}
