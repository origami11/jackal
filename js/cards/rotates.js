import { Card } from '../components/card.js';

export class RotateCard extends Card {
    constructor(image, n) { 
        super(image);  
        this.waitMoves = n;
    }    

    updatePos(pirate) {
        if (pirate.waitMoves == 0) {
            pirate.waitMoves = this.waitMoves;
        } else {
            pirate.waitMoves -= 1;
        }

        super.updatePos(pirate);
    }

    nextMove(pirate, x, y) {
        if (pirate.waitMoves == 0) {
            return super.nextMove(pirate, x, y);
        } else {
            return pirate.x == x && pirate.y == y;
        }
    }
}


export class Rotate2n extends RotateCard {
    constructor() { 
        super('rotate_2n', 1);  
    }    
}

export class Rotate3n extends RotateCard {
    constructor() { 
        super('rotate_3n', 2);  
    }    
}

export class Rotate4n extends RotateCard {
    constructor() { 
        super('rotate_4n', 3);  
    }    
}

export class Rotate5n extends RotateCard {
    constructor() { 
        super('rotate_5n', 4);  
    }    
}
