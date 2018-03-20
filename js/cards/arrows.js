import { Card } from '../components/card.js';

var steps = [
    [ 1,  0],
    [ 1, -1],
    [ 0, -1],
    [-1, -1],
    [-1,  0],
    [-1,  1],
    [ 0,  1],
    [ 1,  1]
];

// Фиксированный поворот координат
function rot(n, x, y) {
    for(var i = 0; i < steps.length; i++) {
        var item = steps[i]
        if (item[0] == x && item[1] == y) {
            return steps[(i + n*2) % steps.length];
        }
    }
    return steps[0];
}

function offsetEq(p, r, x, y) {
    return (p.x + r[0] == x) && (p.y + r[1] == y);
}

class ArrowCard extends Card {
    constructor(image) { 
        super(image);  
        this.repeatMove = true;

        this.n = Math.round(Math.random()*3);
        var angle = -this.n*90;

        this.element.style.transform = 'rotate('+angle+'deg)';
    } 
}

export class Arrow1 extends ArrowCard {
    constructor() { 
        super('arrow_01');  
    } 

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, 1, 0);
        return offsetEq(pirate, r0, x, y);
    }   
}

export class Arrow2 extends ArrowCard {
    constructor() { 
        super('arrow_02');  
        this.repeatMove = true;
    }   

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, 1, -1);
        return offsetEq(pirate, r0, x, y);
    }    
}

export class Arrow3 extends ArrowCard {
    constructor() { 
        super('arrow_03');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, 1, 0);
        var r1 = rot(this.n, -1, 0);

        return [r0, r1].some(r => offsetEq(pirate, r, x, y));
    }   
}

export class Arrow4 extends ArrowCard {
    constructor() { 
        super('arrow_04');  
    }

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, -1, 1);
        var r1 = rot(this.n, 1, -1);

        return [r0, r1].some(r => offsetEq(pirate, r, x, y));
    }    
}

export class Arrow5 extends ArrowCard {
    constructor() { 
        super('arrow_05');  
    }    

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, -1, -1);
        var r1 = rot(this.n, +1, 0);
        var r2 = rot(this.n, 0, 1);

        return [r0, r1, r2].some(r => offsetEq(pirate, r, x, y));
    }
}

export class Arrow6 extends ArrowCard {
    constructor() { 
        super('arrow_06');  
    }    

    nextMove(pirate, x, y, lastPos) {
        var r0 = [-1,  0];
        var r1 = [+1,  0];
        var r2 = [ 0,  1];
        var r3 = [ 0, -1];

        return [r0, r1, r2, r3].some(r => offsetEq(pirate, r, x, y));
    }
}

export class Arrow7 extends ArrowCard {
    constructor() { 
        super('arrow_07');  
    }

    nextMove(pirate, x, y, lastPos) {
        var r0 = [ 1, -1];
        var r1 = [ 1,  1];
        var r2 = [-1,  1];
        var r3 = [-1, -1];

        return [r0, r1, r2, r3].some(r => offsetEq(pirate, r, x, y));
    }    
}
