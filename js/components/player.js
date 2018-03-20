
import { Listener } from '../listener.js';
import { Ship } from './ship.js';
import { Pirate } from './pirate.js';

export class Player {
    constructor(x, y, color) {
        this.color = color;

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
}
