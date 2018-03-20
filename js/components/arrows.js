import { Card } from './card.js';

export class Arrow1 extends Card {
    constructor() { 
        super('arrow_01');  
        this.repeatMove = true;
    } 

    nextMove(pirate, x, y) {
        return pirate.x + 1 == x && pirate.y == y;
    }   
}

export class Arrow2 extends Card {
    constructor() { 
        super('arrow_02');  
        this.repeatMove = true;
    }   

    nextMove(pirate, x, y) {
        return pirate.x + 1 == x && pirate.y - 1 == y;
    }    
}

export class Arrow3 extends Card {
    constructor() { 
        super('arrow_03');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
        return (pirate.x + 1 == x && pirate.y == y) || 
            (pirate.x - 1 == x && pirate.y == y);
    }   
}

export class Arrow4 extends Card {
    constructor() { 
        super('arrow_04');  
        this.repeatMove = true;
    }

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y + 1 == y) || 
            (pirate.x + 1 == x && pirate.y - 1 == y);
    }    
}

export class Arrow5 extends Card {
    constructor() { 
        super('arrow_05');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y - 1 == y) || 
            (pirate.x + 1 == x && pirate.y == y) || 
            (pirate.x  == x && pirate.y + 1 == y);
    }
}

export class Arrow6 extends Card {
    constructor() { 
        super('arrow_06');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y == y) ||
            (pirate.x + 1 == x && pirate.y == y) ||
            (pirate.x == x && pirate.y + 1 == y) ||
            (pirate.x == x && pirate.y - 1 == y);
    }
}

export class Arrow7 extends Card {
    constructor() { 
        super('arrow_07');  
        this.repeatMove = true;
    }

    nextMove(pirate, x, y) {
        return (pirate.x + 1 == x && pirate.y - 1== y)
            || (pirate.x + 1 == x && pirate.y + 1 == y)
            || (pirate.x - 1 == x && pirate.y + 1 == y)
            || (pirate.x - 1 == x && pirate.y - 1 == y);
    }    
}
