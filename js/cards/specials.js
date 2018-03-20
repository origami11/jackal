import { Card } from '../components/card.js';

export class Ice extends Card {
    constructor() { 
        super('ice'); 
        this.repeatMove = true;
    }    
}

export class Trap extends Card {
    constructor() { 
        super('trap'); 
        this.waitMoves = -1;
    }    
}

export class Alligator extends Card {
    constructor() { 
        super('alligator'); 
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y, lastPos) {
        var prev = lastPos[lastPos.length - 1];
        return x == prev.x && y == prev.y;
    }
}

export class Balloon extends Card {
    constructor() { super('balloon'); }    
}

export class Cannon extends Card {
    constructor() { super('cannon'); }    
}

export class Default extends Card {
    constructor() { super('default'); }    
}

export class Girl extends Card {
    constructor() { super('girl'); }    
}

export class Plane extends Card {
    constructor() { 
        super('plane'); 
    }    

    nextMove(pirate, x, y, lastPos) {
        return true;
    }
}

export class Rum extends Card {
    constructor() { 
        super('rum'); 
        this.waitMoves = 1;
    }
}

export class Horse extends Card {
    constructor() { 
        super('horse'); 
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
    constructor() { super('fortress'); }    
}

export class Cannibal extends Card {
    constructor() { super('cannibal'); }    
}
