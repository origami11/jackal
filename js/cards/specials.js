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
    constructor(rotN) { 
        super('balloon', rotN);
        this.repeatMove = true; 
        this.allowToOcean = true;
    }    

    nextMove(pirate, x, y, lastPos) {
        // pirate.player.ship.x == x && pirate.player.ship.y == y
        return false;
    }
}

export class Cannon extends Card {
    constructor(rotN) {
        super('cannon', rotN); 
        this.allowToOcean = true;
        this.repeatMove = true; 
    }

    nextMove(pirate, x, y, lastPos) {
        if (this.n == 0) {
            return this.x == x && y == -1;
        }
        if (this.n == 1) {
            return this.y == y && x == -1;
        }
        if (this.n == 2) {
            return this.x == x && y == 11;
        }
        if (this.n == 3) {
            return this.y == y && x == 11;
        }
        return false;
    }    
}

export class Default extends Card {
    constructor(rotN) { super('default', rotN); }    
}

export class Girl extends Card {
    constructor(rotN) { 
        super('girl', rotN); 
    }    
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
    constructor(rotN) { 
        super('fortress', rotN); 
        this.allowWithGold = false;
        this.allowWithPirates = true;
    }    
}

export class Cannibal extends Card {
    constructor(rotN) { 
        super('cannibal', rotN); 
    }    
}
