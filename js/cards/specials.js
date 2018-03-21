import { Card } from '../components/card.js';

export class Ice extends Card {
    constructor(rotN) { 
        super('ice', rotN); 
        this.repeatMove = true;
    }    
}

export class Trap extends Card {
    constructor(rotN) { 
        super('trap', rotN); 
        this.waitMoves = -1;
    }    
}

export class Alligator extends Card {
    constructor(rotN) { 
        super('alligator', rotN); 
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y, lastPos) {
        var prev = lastPos[lastPos.length - 1];
        return x == prev.x && y == prev.y;
    }
}

export class Balloon extends Card {
    constructor(rotN) { super('balloon', rotN); }    
}

export class Cannon extends Card {
    constructor(rotN) { super('cannon', rotN); }    
}

export class Default extends Card {
    constructor(rotN) { super('default', rotN); }    
}

export class Girl extends Card {
    constructor(rotN) { super('girl', rotN); }    
}

export class Plane extends Card {
    constructor(rotN) { 
        super('plane', rotN); 
    }    

    nextMove(pirate, x, y, lastPos) {
        return true;
    }
}

export class Rum extends Card {
    constructor(rotN) { 
        super('rum', rotN); 
        this.waitMoves = 1;
    }
}

export class Horse extends Card {
    constructor(rotN) { 
        super('horse', rotN); 
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y, lastPos) {
        return (pirate.x + 2 == x && pirate.y + 1 == y)
            || (pirate.x + 2 == x && pirate.y - 1 == y)
            || (pirate.x - 2 == x && pirate.y + 1 == y)
            || (pirate.x - 2 == x && pirate.y - 1 == y)

            || (pirate.x + 1 == x && pirate.y + 2 == y)
            || (pirate.x + 1 == x && pirate.y - 2 == y)
            || (pirate.x - 1 == x && pirate.y + 2 == y)
            || (pirate.x - 1 == x && pirate.y - 2 == y);
    }
}

export class Fortress extends Card {
    constructor(rotN) { super('fortress', rotN); }    
}

export class Cannibal extends Card {
    constructor(rotN) { super('cannibal', rotN); }    
}
