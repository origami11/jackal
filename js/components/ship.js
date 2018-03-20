
import { m } from '../utils.js';
import { cellSize } from '../options.js';

export class Ship {
    constructor(x, y, color) {
        this.side = 0;

        const dx = 1;
        this.size = cellSize;
        this.goldCount = 0;
        this.color = color;

        this.element = m('div', 'player-ship', {
            width: this.size + 'px',
            height: this.size + 'px',
        });

        var back = m('div', 'ship-back', {
            width: (this.size - dx*2) + 'px',
            height: (this.size - dx*2) + 'px',
            top: dx + 'px',
            left: dx + 'px',
            border: "4px solid " + color,
            backgroundImage: 'url(images/ship_01.png)'            
        });

        this.gold = m('div', 'gold', {'display': 'none'});

        this.element.appendChild(back);
        this.element.appendChild(this.gold);

        this.setXY(x, y);
        this.setGoldCount(this.goldCount);
    }

    setGoldCount(n) {
        this.goldCount = n;
        this.gold.textContent = n;
        this.gold.style.display = (this.goldCount == 0) ? 'none' : 'block';
    }

    addGold() {
        this.setGoldCount(this.goldCount + 1);
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = (x * cellSize) + 'px';
        this.element.style.top = (y * cellSize) + 'px';
    }
}
