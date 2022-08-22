import { Card, registerCard } from '../components/card.js';

export class RotateCard extends Card {
    public waitMoves;
    constructor(image, rotN, n) { 
        super(image, rotN);  
        this.allowWithPirates = true;
        this.waitMoves = n;
    }    

    enterCard(pirate) {
        pirate.waitMoves = this.waitMoves
    }

    nextStep(pirate) {
        if (pirate.waitMoves > 0) {
            pirate.waitMoves -= 1;
        }

        super.nextStep(pirate);
    }

    nextMove(pirate, x, y, lastPos) {
        if (pirate.waitMoves == 0) {
            return super.nextMove(pirate, x, y, lastPos);
        } else {
            return pirate.x == x && pirate.y == y;
        }
    }
}


class Rotate2n extends RotateCard {
    constructor(rotN) { 
        super('rotate_2n', rotN, 1);  
    }    
}

registerCard('rotate_2n', Rotate2n);

export class Rotate3n extends RotateCard {
    constructor(rotN) { 
        super('rotate_3n', rotN, 2);  
    }    
}

registerCard('rotate_3n', Rotate3n);

export class Rotate4n extends RotateCard {
    constructor(rotN) { 
        super('rotate_4n', rotN, 3);  
    }    
}

registerCard('rotate_4n', Rotate4n);

export class Rotate5n extends RotateCard {
    constructor(rotN) { 
        super('rotate_5n', rotN, 4);  
    }    
}

registerCard('rotate_5n', Rotate5n);
