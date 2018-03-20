import { m } from '../utils.js';
import { cellSize } from '../options.js';

export class Pirate {
    constructor(x, y, color, id) {   
        this.color = color; 
        this.goldCount = 0;
        this.waitMoves = 0;

        this.element = m('div', 'player', {
            width: cellSize + 'px',
            height: cellSize + 'px',
            zIndex: 1000 - id
        });

        this.image = m('div', 'player-image', {
            background: color
        });

        this.gold = m('div', 'player-gold', {display: 'none'});
        this.text = m('span', 'player-text', {});
        this.image.appendChild(this.text);
        this.image.appendChild(this.gold);

        this.text.textContent = id;

        this.element.appendChild(this.image);

        this.setXY(x, y);
        this.setGoldCount(this.goldCount);
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = (x * cellSize) + 'px';
        this.element.style.top = (y * cellSize) + 'px';
    }

    setGoldCount (n) {
        this.goldCount = n;
        this.gold.style.display = (n == 0) ? 'none' : 'block';        
    }

    setActive(flag) {
        this.element.style.opacity = flag ? 1 : 0.8;
    }
}
