import { m } from '../utils.js';
import { cellSize } from '../options.js';

export class Pirate {
    constructor(x, y, color, id) {   
        this.color = color; 
        this.goldCount = 0;
        this.waitMoves = 0;
        this.waitLoop = 0;
        this.pID = 0; // Родительский ID

        this.isDead = false;
        this.ID = id;

        this.element = m('div', 'player', {
            width: cellSize + 'px',
            height: cellSize + 'px',
            zIndex: 1000 - (id + 1)
        });

        this.image = m('div', 'player-image', {
            background: color
        });

        this.gold = m('div', 'player-gold', {display: 'none'});
        this.text = m('span', 'player-text', {});
        this.image.appendChild(this.text);
        this.image.appendChild(this.gold);

        this.text.textContent = (id + 1);

        this.element.appendChild(this.image);

        this.setXY(x, y);
        this.setGoldCount(this.goldCount);
    }

    allowMove() {
        return this.waitLoop == 0 && this.isDead == false;
    }

    nextLoop() {
        if (this.card) {
            this.card.updateLoop(this);
        }
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = (x * cellSize) + 'px';
        this.element.style.top = (y * cellSize) + 'px';
    }

    matchXY(x, y) {
        return this.x == x && this.y == y;
    }

    setGoldCount (n) {
        this.goldCount = n;
        this.gold.style.display = (n == 0) ? 'none' : 'block';        
    }

    setActive(flag, step) {
        this.element.style.opacity = flag ? 1 : 0.8;
    }

    getStatusName() {
        var n = (this.ID + 1);
        if (this.isDead && this.player.canBeResurected(this)) {
            return 'Воскресить #' + n
        }

        if (this.isDead) {
            return 'Умер #' + n
        }
        if (this.waitMoves > 0) {
            return 'Пират #' + n + ' (M'+this.waitMoves+')'; 
        }
        if (this.waitLoop > 0) {
            return 'Пират #' + n + ' (L'+this.waitLoop+')'; 
        }
        if (this.player.isMoving(this)) {   
            return 'Пират #' + n + '(Ход)';
        }

        return 'Пират #' + n;
    }

    isFriend(p) {
        return this.pID = p.pID;
    }

    setDead() {
        this.isDead = true;
        this.setXY(-2, -2);
        this.element.style.display = 'none';
    }

    setLive(x, y) {
        this.isDead = false;
        this.setXY(x, y);
        this.element.style.display = 'block';
    }        
}
