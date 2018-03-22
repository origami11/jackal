import { m } from '../utils.js';
import { cellSize, debugGold } from '../options.js';

export class Card {    
    constructor(image, rotN) {
        const dx = 1;
        this.size = cellSize;
        this.isOpen = false;
        this.repeatMove = false;
        this.allowWithGold = true;
        this.allowWithPirates = false;
        this.allowToOcean = false;
        this.image = image;

        this.goldCount = 0;

        this.element = m('div', 'container', {
            width: this.size + 'px',
            height: this.size + 'px'
        });

        this.card = m('div', 'card', { });

        var back = m('figure', 'back', {
            width: (this.size - dx*2) + 'px',
            height: (this.size - dx*2) + 'px',
            top: dx + 'px',
            left: dx + 'px',
            backgroundImage: 'url(images/' + image + '.png)'            
        });

        var front = m('figure', 'front', {
            width: (this.size - dx*2) + 'px',
            height: (this.size - dx*2) + 'px',
            top: dx + 'px',
            left: dx + 'px',
            backgroundImage: 'url(images/default.png)'            
        });

        this.gold = m('div', 'gold', {'display': 'none'});

        this.card.appendChild(front);
        this.card.appendChild(back);
       
        this.element.appendChild(this.card);
        this.element.appendChild(this.gold);

        this.card.addEventListener("transitionend", () => {
            this.element.style.zIndex = 1;
        }, false);

        this.setGoldCount(0);

//        var angle = Math.round(Math.random()*3)*90;
//        this.element.style.transform = 'rotate('+angle+'deg)';

        this.x = 0;
        this.y = 0;

        this.n = rotN;

        var angle = -this.n*90;
        this.card.style.transform = 'rotateZ('+angle+'deg)';
    }

    setGoldCount(n) {
        this.goldCount = n;
        this.gold.textContent = n;
        this.gold.style.display = (this.goldCount == 0 || (debugGold ? false : this.isOpen == false)) ? 'none' : 'block';
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = (x * this.size) + 'px';
        this.element.style.top = (y * this.size) + 'px';
    }

    nextMove(pirate, x, y, lastPos) {
        return (Math.abs(pirate.x - x) <= 1 && Math.abs(pirate.y - y) <= 1) && (y != this.y || x != this.x);
    }

    updatePos(pirate) {
        pirate.setXY(this.x, this.y);
    }

    setActive(flag, color) {
        if (flag) {
            this.element.classList.add('active');
        } else {
            this.element.classList.remove('active');
        }
    }

    flip() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.element.style.zIndex = 100;

            var angle = -this.n*90;
            this.card.style.transform = 'rotateZ('+angle+'deg) rotateY(180deg)';

//            this.card.classList.add('flipped');
            this.setGoldCount(this.goldCount);
        }
    }
}
