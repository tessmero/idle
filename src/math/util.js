// shorthands
var pi = Math.PI
var pio2 = Math.PI/2
var twopi = 2*Math.PI
var sqrt2 = Math.sqrt(2)
var phi = 1.618033988749894
function v(){return new Vector(...arguments)}
function vp(){return Vector.polar(...arguments)}


function rectCenter(x,y,w,h){
    return [x+w/2,y+h/2]
}

function padRect(x,y,w,h,p){
    return [x-p,y-p,w+2*p,h+2*p]
}

function vInRect(p,x,y,w,h){
    let result = (p.x>=x) && (p.x<=(x+w)) && (p.y>=y) && (p.y<=(y+h))   
    return result
}

function inRect(px,py,x,y,w,h){
    return (px>=x) && (px<=(x+w)) && (py>=y) && (py<=(y+h))
}

function randRange(min,max){
    return min + rand()*(max-min)
}

function randChoice(options){
    return options[Math.floor( Math.random() * options.length )]
}

function cleanAngle(a){
    a = nnmod(a,twopi)
    if( a > Math.PI ){
        a -= twopi
    }
    if( a < -Math.PI ){
        a += twopi
    }
    return a        
}

// oscillate from 0 to 1
function pulse(period,offset=0){
    return (Math.sin(offset + global.t * twopi/period)+1)/2
}

//non-negative mod
function nnmod(a,b){
    var r = a%b
    return (r>=0) ? r : r+b
}

// weighted avg
function avg(a,b,r=.5){
    return (a*(1.0-r)) + (b*r)
}
function va(a,b,r=.5){
    return v(avg(a.x,b.x,r),avg(a.y,b.y,r))
}
function la(l1,l2,r){
    return [va(l1[0],l2[0],r),va(l1[1],l2[1],r)]
}

function arePointsClockwise(p1,p2,p3,p4) {
    const crossProduct = (p1[0] - p2[0]) * (p3[1] - p2[1]) - (p1[1] - p2[1]) * (p3[0] - p2[0]);
    return crossProduct > 0;
}


// compute intersection point of two lines
// the two lines are described by pairs of points
// requires two lists, each containing 2 xy points
function intersection( ab1, ab2 ){
    var mb1 = mb(...ab1)
    var mb2 = mb(...ab2)
    
    if( mb1.m == Infinity ){
        var x = ab1[0].x
        var y = mb2.m*x + mb2.b
    } else if (mb2.m == Infinity ){
        var x = ab2[0].x
        var y = mb1.m*x + mb1.b
    } else {
        //m1*x+b1 = m2*x+b2
        //m1*x-m2*x = b2-b1
        //x = (b2-b1)/(m1-m2)
        var x = (mb2.b-mb1.b)/(mb1.m-mb2.m)
        var y = mb1.m*x + mb1.b
    }
    
    return new Vector( x, y )
}

// compute slope and intercept
// euclidean line with points a and b
function mb(a,b){
    var m = (b.y-a.y)/(b.x-a.x)
    var b = a.y - m*a.x 
    return {m:m,b:b}
}

// https://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
