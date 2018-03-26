
import { Listener } from '../listener.js';
import { Ship } from './ship.js';
import { Pirate } from './pirate.js';

export class Player {
    constructor(x, y, color, id) {
        this.step = 0;
        this.color = color;
        this.moveShip = false;
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

    piratesOnShip() {
       return this.pirates.reduce((s, p) => s + (this.pirateOnShip(p) ? 1 : 0), 0);
    }

    hasPirateXY(x, y) {
        return this.pirates.some(p => (p.x == x && p.y == y));
    }

    setShipXY(x, y) {        
        if (this.piratesOnShip() > 0 && this.testRanage(this.ship.x, this.ship.y, x, y)) {
            this.pirates.forEach(p => {
                if (this.pirateOnShip(p)) {
                    p.setXY(x, y);
                }
            })                        
            this.ship.setXY(x, y);
            return true;
        }
        return false;
    }
}
