
import { Listener } from '../listener.js';
import { Ship } from './ship.js';
import { Pirate } from './pirate.js';

export class Player {
    constructor(x, y, color) {
        this.color = color;
        this.moveShip = false;

        this.activeElement = 0;
        this.status = new Listener();
        this.pirates = [new Pirate(x, y, color, 1), new Pirate(x, y, color, 2), new Pirate(x, y, color, 3)];
        this.ship = new Ship(x, y, color);
    }

    setActive(flag) {
        this.pirates[0].setActive(flag);
        this.status.fire(flag);
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

    setShipXY(x, y) {        
        if (this.testRanage(this.ship.x, this.ship.y, x, y)) {
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
