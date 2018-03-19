//"use strict";
import { m, shuffle } from './utils.js';
import { Listener } from './listener.js';

const cellSize = 72;
const debugGold = false; 
//const cellSize = 164;

class Ship {
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

class Pirate {
    constructor(x, y, color) {   
        this.color = color; 
        this.goldCount = 0;

        this.element = m('div', 'player', {
            width: cellSize + 'px',
            height: cellSize + 'px'
        });

        this.image = m('div', 'player-image', {
            background: color
        });

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
        this.image.textContent = n;
    }

    setActive(flag) {
        this.element.style.opacity = flag ? 1 : 0.8;
    }
}

class Player {
    constructor(x, y, color) {
        this.color = color;

        this.activeElement = 0;
        this.status = new Listener();
        this.pirates = [new Pirate(x, y, color)];
        this.ship = new Ship(x, y, color);
    }

    setActive(flag) {
        this.pirates[0].setActive(flag);
        this.status.fire(flag);
    }

    getActiveElement() {
        return this.pirates[this.activeElement];
    }

    pirateOnShip(p) {
        return p.x == this.ship.x && p.y == this.ship.y;
    }
}

class Card {    
    constructor(image) {
        const dx = 1;
        this.size = cellSize;
        this.isOpen = false;
        this.repeatMove = false;
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

    nextMove(pirate, x, y) {
        return (Math.abs(pirate.x - x) <= 1 && Math.abs(pirate.y - y) <= 1);
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
            this.card.classList.add('flipped');
            this.setGoldCount(this.goldCount);
        }
    }
}


class Rotate2n extends Card {
    constructor() { super('rotate_2n');  }    
}

class Rotate3n extends Card {
    constructor() { super('rotate_3n');  }    
}

class Rotate4n extends Card {
    constructor() { super('rotate_4n');  }    
}

class Rotate5n extends Card {
    constructor() { super('rotate_5n');  }    
}

class Arrow1 extends Card {
    constructor() { 
        super('arrow_01');  
        this.repeatMove = true;
    } 

    nextMove(pirate, x, y) {
        return pirate.x + 1 == x && pirate.y == y;
    }   
}

class Arrow2 extends Card {
    constructor() { 
        super('arrow_02');  
        this.repeatMove = true;
    }   

    nextMove(pirate, x, y) {
        return pirate.x + 1 == x && pirate.y - 1 == y;
    }    
}

class Arrow3 extends Card {
    constructor() { 
        super('arrow_03');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
        return (pirate.x + 1 == x && pirate.y == y) || 
            (pirate.x - 1 == x && pirate.y == y);
    }   
}

class Arrow4 extends Card {
    constructor() { 
        super('arrow_04');  
        this.repeatMove = true;
    }

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y + 1 == y) || 
            (pirate.x + 1 == x && pirate.y - 1 == y);
    }    
}

class Arrow5 extends Card {
    constructor() { 
        super('arrow_05');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y - 1 == y) || 
            (pirate.x + 1 == x && pirate.y == y) || 
            (pirate.x  == x && pirate.y + 1 == y);
    }
}

class Arrow6 extends Card {
    constructor() { 
        super('arrow_06');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y == y) ||
            (pirate.x + 1 == x && pirate.y == y) ||
            (pirate.x == x && pirate.y + 1 == y) ||
            (pirate.x == x && pirate.y - 1 == y);
    }
}

class Arrow7 extends Card {
    constructor() { 
        super('arrow_07');  
        this.repeatMove = true;
    }

    nextMove(pirate, x, y) {
        return (pirate.x + 1 == x && pirate.y - 1== y)
            || (pirate.x + 1 == x && pirate.y + 1 == y)
            || (pirate.x - 1 == x && pirate.y + 1 == y)
            || (pirate.x - 1 == x && pirate.y - 1 == y);
    }    
}

class Empty1 extends Card {
    constructor() { super('empty_01');  }    
}

class Empty2 extends Card {
    constructor() { super('empty_02'); }    
}

class Empty3 extends Card {
    constructor() { super('empty_03'); }    
}

class Empty4 extends Card {
    constructor() { super('empty_04'); }    
}

class Ice extends Card {
    constructor() { 
        super('ice'); 
        this.repeatMove = true;
    }    
}

class Trap extends Card {
    constructor() { super('trap'); }    
}

class Alligator extends Card {
    constructor() { super('alligator'); }    
}

class Balloon extends Card {
    constructor() { super('balloon'); }    
}

class Cannon extends Card {
    constructor() { super('cannon'); }    
}

class Default extends Card {
    constructor() { super('default'); }    
}

class Gold1 extends Card {
    constructor() { 
        super('gold_01'); 
        this.setGoldCount(1);
    }    
}

class Gold2 extends Card {
    constructor() { 
        super('gold_02'); 
        this.setGoldCount(2);
    }    
}

class Gold3 extends Card {
    constructor() { 
        super('gold_03'); 
        this.setGoldCount(3);
    }    
}

class Gold4 extends Card {
    constructor() { 
        super('gold_04'); 
        this.setGoldCount(4);
    }    
}

class Gold5 extends Card {
    constructor() { 
        super('gold_05'); 
        this.setGoldCount(5);
    }    
}

class Girl extends Card {
    constructor() { super('girl'); }    
}

class Plane extends Card {
    constructor() { 
        super('plane'); 
    }    

    nextMove(pirate, x, y) {
        return true;
    }
}

class Rum extends Card {
    constructor() { super('rum'); }
}

class Horse extends Card {
    constructor() { 
        super('horse'); 
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
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

class Fortress extends Card {
    constructor() { super('fortress'); }    
}

class Cannibal extends Card {
    constructor() { super('cannibal'); }    
}

class FreeCell {
}

class GameBoard {  
    constructor(w, h, root) {
        this.width = w;
        this.height = h;
        this.colors = ['white', 'red', 'yellow', 'green'];
        this.onmove = new Listener();

        this.cards = [
            [Empty1, 10], [Empty2, 10], [Empty3, 10], [Empty4, 10], 
            [Arrow1, 3], [Arrow2, 3], [Arrow3, 3], [Arrow4, 3], [Arrow5, 3], [Arrow6, 3], [Arrow7, 3],  
            [Ice, 6], 
            [Girl, 1], 
            [Trap, 3], 
            [Alligator, 4], 
            [Balloon, 2], 
            [Cannibal, 1], 
            [Cannon, 2], 
            [Horse, 2], 
            [Fortress, 2], 
            [Rum, 4], 
            [Plane, 1], 
            [Gold1, 5], [Gold2, 5], [Gold3, 3], [Gold4, 2], [Gold5, 1],
            [Rotate2n, 5], [Rotate3n, 4], [Rotate4n, 2], [Rotate5n, 1] 
        ];

        this.deck = [];

        this.activePlayer = 0;
        this.players = [
            new Player(-1, 5, '#D32F2F'), 
            new Player(5, -1, '#FBC02D'),
            new Player(11, 5, '#388E3C'), 
            new Player(5, 11, '#0288D1') 
        ];

        this.makeDeck();    
        this.setCardXY();

        this.element = m('div', 'playground', {
            width: cellSize * (w + 2) + 'px',
            height: cellSize * (h + 2) + 'px'
        });


        this.grid = m('div', 'grid', {
            width: cellSize * w + 'px',
            height: cellSize * h + 'px',
            top: cellSize + 'px',
            left: cellSize + 'px'
        });

        this.element.appendChild(this.grid)
        root.style.width = cellSize * (w + 2) + 'px';
        root.style.height = cellSize * (h + 2) + 'px';
        root.appendChild(this.element);

        this.element.addEventListener('click', (event) => {
        
            var x = Math.floor((event.clientX - this.element.offsetLeft) / cellSize) - 1;
            var y = Math.floor((event.clientY - this.element.offsetTop) / cellSize) - 1;

            // console.log(x, y);

            var next = this.getCard(x, y);
            var p = this.getActivePlayer();
            var pirate = p.getActiveElement();
            var current = this.getCard(pirate.x, pirate.y);

            var doMove = false;

            if ((next && current && current.nextMove(pirate, x, y)) || 
                (next && !current && this.nextMove(pirate, x, y))) {

                next.flip();
                next.updatePos(pirate);

                if (!next.repeatMove) {
                    p.setActive(false);
                    this.nextPlayer();
                }

                doMove = true;
            }

            if (p.ship.x == x && p.ship.y == y) {
                pirate.setXY(p.ship.x, p.ship.y);

                p.setActive(false);
                this.nextPlayer();

                doMove = true;
            }


            if (doMove) {
                p = this.getActivePlayer();
                p.setActive(true);
                this.showMoves(p.getActiveElement());
            }
        });

        var player = this.getActivePlayer();
        this.render();
        this.showMoves(player.getActiveElement());
        this.players.forEach(p => {
            p.setActive(p == player);
        });
    }

    getActivePlayer() {
        return this.players[this.activePlayer];
    }

    showMoves(p) {
        var card = this.getCard(p.x, p.y);
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {
                var cardForMove = this.getCard(x, y);
                if (cardForMove) {
                    var canMove = card ? card.nextMove(p, x, y) : this.nextMove(p, x, y);                
                    var isActive = (canMove && (cardForMove.isOpen || p.goldCount == 0));

                    cardForMove.setActive(isActive, p.color);
                    
                }
            }
        }

        this.onmove.fire(); 
    }

    nextMove(pirate, x, y) {
        return (Math.abs(pirate.x - x) <= 1 && Math.abs(pirate.y - y) <= 1);
    }

    nextPlayer() {
        this.activePlayer++;
        if (this.activePlayer >= this.players.length) {
            this.activePlayer = 0;
        }
    }
    
    getCard(x, y) {
        for(var i = 0; i < this.deck.length; i++) {
            var card = this.deck[i];
            if (card.x == x && card.y == y) {
                return card;
            }
        }
        return null;
    }

    makeDeck() {
        var count = this.width * this.height - 4;
        var sum = 0;

        this.cards.forEach((card) => {
            sum += card[1];
            for(var i = 0; i < card[1]; i++) {
                this.deck.push(new card[0]());
            }
        });

        for(var i = 0; i < count - sum; i++) {  
            this.deck.push(new Default());
        }

        console.log(sum, count - sum);

        this.deck = shuffle(this.deck);
    }

    setCardXY() {
        var n = 0;
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {
                if (!this.isCorner(x, y)) {
                    this.deck[n].setXY(x, y);
                    n ++;
                }
            }
        }
    }

    isCorner(x, y) {
        return (x == 0 && y == 0) 
            || (x == 0 && y == this.height - 1) 
            || (x == this.width - 1 && y == 0) 
            || (x == this.width - 1 && y == this.height - 1);
    }

    render(id) {
        
        this.deck.forEach(item => {
            this.grid.appendChild(item.element);
        });

        this.players.forEach(player => {
            player.pirates.forEach(pirate => {
                this.grid.appendChild(pirate.element);
            });
            this.grid.appendChild(player.ship.element);
        });

        var root = document.getElementById('info');
        this.players.forEach(item => {
            let info = m('div', 'player-info', {
                background: item.color 
            }); 
            item.status.subscribe((f) => {
                // console.log(item.color, f);
                info.style.opacity = f ? 1 : 0.2;
            });
            root.appendChild(info);
        });

        var actionBtn = m('button', 'get-money', {'display': 'none'});
        actionBtn.textContent = 'Взять монету';
        root.appendChild(actionBtn);

        actionBtn.addEventListener('click', () => {
            var player = this.getActivePlayer();
            var p = player.getActiveElement();
            var current = this.getCard(p.x, p.y);

            if (current && p.goldCount == 0 && current.goldCount > 0) {
                current.setGoldCount(current.goldCount - 1);
                p.setGoldCount(1);
            } else if (current && p.goldCount > 0) {
                current.setGoldCount(current.goldCount + 1);
                p.setGoldCount(0);
            } else if (p.goldCount > 0 && player.pirateOnShip(p)) {
                player.ship.addGold();
                p.setGoldCount(0);
            }

            this.showMoves(p);
        });

        this.onmove.subscribe(() => {
            var p = this.getActivePlayer().getActiveElement();
            var current = this.getCard(p.x, p.y);
            if (current && p.goldCount == 0 && current.goldCount > 0) {
                actionBtn.textContent = 'Взять монету';
                actionBtn.style.display = 'block';
            } else if (p.goldCount > 0) {
                actionBtn.textContent = 'Положить монету';
                actionBtn.style.display = 'block';
            } else {
                actionBtn.style.display = 'none';
            }
        });
    }
}


var root = document.getElementById('root');
let g = new GameBoard(11, 11, root);

