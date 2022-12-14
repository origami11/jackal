import { Card, registerCard } from '../components/card.js';

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
    constructor(image, rotN) { 
        super(image, rotN);  
        this.repeatMove = true;
        this.allowDropGold = false;
        this.allowToOcean = true;
    } 
}

class Arrow1 extends ArrowCard {
    constructor(rotN) { 
        super('arrow_01', rotN);  
    } 

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, 1, 0);
        return offsetEq(pirate, r0, x, y);
    }   
}

registerCard('arrow_01', Arrow1);

class Arrow2 extends ArrowCard {
    constructor(rotN) { 
        super('arrow_02', rotN);  
        this.repeatMove = true;
    }   

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, 1, -1);
        return offsetEq(pirate, r0, x, y);
    }    
}

registerCard('arrow_02', Arrow2);

class Arrow3 extends ArrowCard {
    constructor(rotN) { 
        super('arrow_03', rotN);  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, 1, 0);
        var r1 = rot(this.n, -1, 0);

        return [r0, r1].some(r => offsetEq(pirate, r, x, y));
    }   
}

registerCard('arrow_03', Arrow3);

class Arrow4 extends ArrowCard {
    constructor(rotN) { 
        super('arrow_04', rotN);  
    }

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, -1, 1);
        var r1 = rot(this.n, 1, -1);

        return [r0, r1].some(r => offsetEq(pirate, r, x, y));
    }    
}

registerCard('arrow_04', Arrow4);

export class Arrow5 extends ArrowCard {
    constructor(rotN) { 
        super('arrow_05', rotN);  
    }    

    nextMove(pirate, x, y, lastPos) {
        var r0 = rot(this.n, -1, -1);
        var r1 = rot(this.n, +1, 0);
        var r2 = rot(this.n, 0, 1);

        return [r0, r1, r2].some(r => offsetEq(pirate, r, x, y));
    }
}

registerCard('arrow_05', Arrow5);

export class Arrow6 extends ArrowCard {
    constructor(rotN) { 
        super('arrow_06', rotN);  
    }    

    nextMove(pirate, x, y, lastPos) {
        var r0 = [-1,  0];
        var r1 = [+1,  0];
        var r2 = [ 0,  1];
        var r3 = [ 0, -1];

        return [r0, r1, r2, r3].some(r => offsetEq(pirate, r, x, y));
    }
}

registerCard('arrow_06', Arrow6);

export class Arrow7 extends ArrowCard {
    constructor(rotN) { 
        super('arrow_07', rotN);  
    }

    nextMove(pirate, x, y, lastPos) {
        var r0 = [ 1, -1];
        var r1 = [ 1,  1];
        var r2 = [-1,  1];
        var r3 = [-1, -1];

        return [r0, r1, r2, r3].some(r => offsetEq(pirate, r, x, y));
    }    
}

registerCard('arrow_07', Arrow7);
