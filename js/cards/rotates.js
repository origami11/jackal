import { Card } from '../components/card.js';

export class RotateCard extends Card {
    constructor(image, rotN, n) { 
        super(image, rotN);  
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

    nextMove(pirate, x, y, lastPos) {
        if (pirate.waitMoves == 0) {
            return super.nextMove(pirate, x, y);
        } else {
            return pirate.x == x && pirate.y == y;
        }
    }
}


export class Rotate2n extends RotateCard {
    constructor(rotN) { 
        super('rotate_2n', rotN, 1);  
    }    
}

export class Rotate3n extends RotateCard {
    constructor(rotN) { 
        super('rotate_3n', rotN, 2);  
    }    
}

export class Rotate4n extends RotateCard {
    constructor(rotN) { 
        super('rotate_4n', rotN, 3);  
    }    
}

export class Rotate5n extends RotateCard {
    constructor(rotN) { 
        super('rotate_5n', rotN, 4);  
    }    
}
