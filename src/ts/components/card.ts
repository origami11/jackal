import { m } from '../utils';
import { cellSize, debugGold } from '../options';

let factory = {};

export function createCard(name, rotN) {
    if (!factory.hasOwnProperty(name)) {
        throw new Error(name + ' is not registered');
    }
    return new factory[name](rotN);
}

export function registerCard(name, fn) {
    if (!factory.hasOwnProperty(name) && fn) {
        factory[name] = fn;
        return;
    }
    throw new Error(name + ' bad registering');
}

export class Card {    
    public goldCount = 0;
    public isOpen: boolean = false;
    public allowDropGold: boolean = true;
    public allowWithGold: boolean = true;
    public allowWithPirates: boolean = false;        
    public allowToOcean: boolean = false;
    public repeatMove: boolean = false;

    public size;
    public x = 0;
    public y = 0;
    public n; /* Количество поворотов */
    public image: string;
    public ID;

    public element: HTMLDivElement;
    public card: HTMLDivElement;
    public gold: HTMLDivElement;
    
    constructor(image, rotN) {
        const dx = 1;
        this.size = cellSize;

        this.image = image;
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

        this.n = rotN;

        var angle = -this.n*90;
        this.card.style.transform = 'rotateZ('+angle+'deg)';
    }

    /* Устанавливает значение золота на карте */
    setGoldCount(n) {
        this.goldCount = n;
        this.gold.textContent = n;
        this.gold.style.display = (this.goldCount == 0 || (debugGold ? false : this.isOpen == false)) ? 'none' : 'block';
    }

    /* Сброс золота на карту */
    addGold(lastPos) {
        if (this.allowDropGold) {
            this.setGoldCount(this.goldCount + 1);
        } else {
            var i = lastPos.length - 1;
            var last = lastPos[i];
            while(i >= 0 && last.card) {
                if (last.card.allowDropGold) {
                    last.card.setGoldCount(last.card.goldCount + 1);
                    break;
                }
                i--;
                last = lastPos[i];
            }
        }
    }

    /* Назначение координат карте */
    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.element.title = ['x: ' + x, 'y: ' +y].join(", ");
        this.element.style.left = (x * this.size) + 'px';
        this.element.style.top = (y * this.size) + 'px';
    }

    /* Возвращает список пиратов на карте */
    getPirates() {
    }

    /* Действие с пиратом когда он переходит на карту */
    enterCard(pirate) {
    }

    /* Действие с пиратом когда он покидает карту */
    leaveCard(pirate) {
    }

    /* Действие на карте по завершении цикла игры */
    nextLoop(pirate) {
    }

    /* Действие на карте при ходе на ней */
    nextStep(pirate) {
    }
   
    /* Проверяет возможность ходить пиратом с укзанной клетки на заданную */
    nextMove(pirate, x, y, lastPos) {
        return (Math.abs(pirate.x - x) <= 1 && Math.abs(pirate.y - y) <= 1) && (y != this.y || x != this.x);
    }

    /* Проверяет возможность пирата ходить на данную клетку */
    allowMove(pirate) {
        return this.isOpen || pirate.goldCount == 0;
    }

    /* Подсвечивает карту (заданным цветом) */
    setActive(flag, color) {
        if (flag) {
            this.element.classList.add('active');
        } else {
            this.element.classList.remove('active');
        }
    }    

    /* Переворачивает карту */
    flip() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.element.style.zIndex = 100;

            var angle = -this.n*90;
            this.card.style.transform = 'rotateZ('+angle+'deg) rotateY(180deg)';

            this.setGoldCount(this.goldCount);
        }
    }
}
