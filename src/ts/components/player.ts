
import { Listener } from '../listener.js';
import { Ship } from './ship.js';
import { Pirate } from './pirate.js';

export class Player {
    public friends: Array<Player>;
    public pirates: Array<Pirate>;
    public step;
    public color;
    public ID;
    public flag;
    public activeElement;
    public status: Listener; 
    public ship: Ship;

    public moveShip = false;

    constructor(x, y, color, id) {
        this.step = 0;
        this.color = color;
        this.friends = [];
        this.ID = id;
        this.flag = false;

        this.activeElement = 0;
        this.status = new Listener();
        this.pirates = [new Pirate(x, y, color, 0), new Pirate(x, y, color, 1), new Pirate(x, y, color, 2)];
        this.pirates.forEach(p => {
            p.pID = id
            p.player = this;
        });

        this.ship = new Ship(x, y, color);
    }

    setActive(flag) {
        if (flag != this.flag) {
            this.pirates[this.activeElement].setActive(flag, this.step);
            this.status.fire(flag);
            this.flag = flag;

            if (flag) {
                this.step ++;
                this.pirates.forEach(p => p.nextLoop());
            }
        }
    }

    canBeResurected(pirate) {
        return this.pirates.find(p => p.card && p.card.image == 'girl');
    }

    isMoving(pirate) {
        return pirate.id == this.activeElement;
    }

    setActiveElement(n) {
        this.activeElement = n;
    }

    getActiveElement() {
        return this.pirates[this.activeElement];
    }

    pirateOnShip(p) {
        var selfShip = p.x == this.ship.x && p.y == this.ship.y;

        for(var i = 0; i < this.friends.length; i++) {
            var f = this.friends[i];
            if (f.ship.x == p.x && f.ship.y == p.y) {
                return true;
            }
        }

        return selfShip;
    }

    pirateOnPlayerShip(p) {
        return p.x == this.ship.x && p.y == this.ship.y;
    }

    testRanage(sx, sy, x, y) {
        if (sx == -1 || sx == 11) {
            return sx == x && (y >= 1 && y <= 9) && Math.abs(y - sy) == 1;
        }
        if (sy == -1 || sy == 11) {
            return sy == y && (x >= 1 && x <= 9) && Math.abs(x - sx) == 1;
        }
    }

    getAllPirates() {
        var list = this.pirates;
        for(var i = 0; i < this.friends.length; i++) {
            list = list.concat(this.friends[i].pirates);
        }
        return list;
    }

    piratesOnShip() {
       return this.getAllPirates().reduce((s, p) => s + (this.pirateOnPlayerShip(p) ? 1 : 0), 0);
    }

    hasPirateXY(x, y) {
        return this.pirates.some(p => (p.x == x && p.y == y));
    }

    setShipXY(x, y) {        
        if (this.piratesOnShip() > 0 && this.testRanage(this.ship.x, this.ship.y, x, y)) {
            this.getAllPirates().forEach(p => {
                if (this.pirateOnPlayerShip(p)) {
                    p.setXY(x, y);
                }
            });
            this.ship.setXY(x, y);
            return true;
        }
        return false;
    }
}
