import { Card, registerCard } from '../components/card.js';

class Ice extends Card {
    constructor(rotN) { 
        super('ice', rotN); 
        this.repeatMove = true;
        this.allowToOcean = true;
        this.allowDropGold = false;
    }    

    nextMove(pirate, x, y, lastPos) {
        var i = lastPos.length - 1;
        var last = lastPos[i];
        var prev = last;

        while (i >= 0 && last.card && last.card.image == 'ice')     {
            i--;
            last = lastPos[i];
        }
        if (last.card && (last.card.image == 'horse' || last.card.image == 'plane')) {
            return last.card.nextMove(pirate, x, y, lastPos);
        }
        var nx = pirate.x + (this.x - prev.x);
        var ny = pirate.y + (this.y - prev.y);
        return nx == x && ny == y;
    }
}

registerCard('ice', Ice);

class Trap extends Card {
    private pirates: Array<any>;

    constructor(rotN) { 
        super('trap', rotN); 
        this.pirates = [];
    }

    getFriends(pirate) {
        return this.pirates.filter(p => pirate.isFriend(p));
    }

    enterCard(pirate) {
        var friends = this.getFriends(pirate);
        if (friends.length > 0) {
            friends.forEach(p => {
                p.waitLoop = 0;
            });
            this.pirates = this.pirates.filter(p => friends.indexOf(p) >= 0);
        } else {
            pirate.waitLoop = -1;
            this.pirates.push(pirate);
        }
    }

    leaveCard(pirate) {
        pirate.waitloop = 0;
        this.pirates = this.pirates.filter(p => p != pirate)        
    }

    /*nextMove(pirate, x, y, lastPos) {
        if (pirate.waitLoop == 0) {
            super.nextMove(pirate, x, y, lastPos);
        } else {
            return pirate.x == x && pirate.y == y;
        }
    }*/
}

registerCard('trap', Trap);

class Alligator extends Card {
    constructor(rotN) { 
        super('alligator', rotN); 
        this.repeatMove = true;
        this.allowDropGold = false;
    }    

    nextMove(pirate, x, y, lastPos) {
        var prev = lastPos[lastPos.length - 1];
        return x == prev.x && y == prev.y;
    }
}

registerCard('alligator', Alligator);

class Balloon extends Card {
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

registerCard('balloon', Balloon);

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


registerCard('cannon', Cannon);


class Default extends Card {
    constructor(rotN) { super('default', rotN); }    
}

registerCard('default', Default);


class FortressCard extends Card {
    private pirates: Array<any>;
    constructor(image, rotN) { 
        super(image, rotN); 
        this.allowWithGold = false;
        this.allowWithPirates = true;
        this.pirates = [];
    }   

    getFriends(pirate) {
        return this.pirates.filter(p => pirate.isFriend(p));
    } 

    enterCard(pirate) {
        var friends = this.getFriends(pirate);
        if (friends.length > 0 || this.pirates.length == 0) {
            this.pirates.push(pirate);
        } else {
            pirate.setDead();
        }
    }

    leaveCard(pirate) {
        this.pirates = this.pirates.filter(p => p != pirate);
    }

    allowMove(pirate) {
        var friends = this.getFriends(pirate);        
        return pirate.goldCount == 0 && (friends.length > 0 || this.pirates.length == 0);
    }
}


class Fortress extends FortressCard {
    constructor(rotN) { 
        super('fortress', rotN);
    }    
}

registerCard('fortress', Fortress);

class Girl extends FortressCard {
    constructor(rotN) { 
        super('girl', rotN); 
    }    
}

registerCard('girl', Girl);

class Plane extends Card {
    constructor(rotN) { 
        super('plane', rotN); 
    }    

    nextMove(pirate, x, y, lastPos) {
        return true;
    }
}

registerCard('plane', Plane);

class Rum extends Card {
    public waitLoop;
    constructor(rotN) { 
        super('rum', rotN); 
        this.waitLoop = 2;
    }

    enterCard(pirate) {
        pirate.waitLoop = this.waitLoop;
    }

    leaveCard(pirate) {
        pirate.waitloop = 0;
    }    

    nextLoop(pirate) {
        if (pirate.waitLoop > 0) {
            pirate.waitLoop -= 1;  
        }
    }
}

registerCard('rum', Rum);

class Horse extends Card {
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

registerCard('horse', Horse);

class Cannibal extends Card {
    constructor(rotN) { 
        super('cannibal', rotN); 
    }    

    enterCard(pirate) {
        pirate.resetMoves();
        pirate.setGoldCount(0);
        pirate.setDead();
    }
}

registerCard('cannibal', Cannibal);
