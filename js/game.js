//"use strict";
import { m, shuffle } from './utils.js';
import { Listener } from './listener.js';

import { Card } from './components/card.js';
import { Player } from './components/player.js';

import { cellSize } from './options.js';

import { Arrow1, Arrow2, Arrow3, Arrow4, Arrow5, Arrow6, Arrow7 } from './cards/arrows.js';
import { Rotate2n, Rotate3n, Rotate4n, Rotate5n } from './cards/rotates.js';
import { Empty1, Empty2, Empty3, Empty4 } from './cards/empty.js';
import { Gold1, Gold2, Gold3, Gold4, Gold5 } from './cards/golds.js';
import { Ice, Trap, Alligator, Balloon, Cannon, Default, Girl,  Plane, Rum, Horse,  Fortress, Cannibal } from './cards/specials.js';

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


        var lastPos = [];

        this.element.addEventListener('click', (event) => {
        
            var x = Math.floor((event.clientX - this.element.offsetLeft) / cellSize) - 1;
            var y = Math.floor((event.clientY - this.element.offsetTop) / cellSize) - 1;

            // console.log(x, y);

            var next = this.getCard(x, y);
            var p = this.getActivePlayer();
            var pirate = p.getActiveElement();
            var current = this.getCard(pirate.x, pirate.y);

            var doMove = false;

            if ((next && current && current.nextMove(pirate, x, y, lastPos)) || 
                (next && !current && this.nextMove(pirate, x, y))) {

                next.flip();
                lastPos.push({x: pirate.x, y: pirate.y});

                next.updatePos(pirate);

                if (!next.repeatMove) {
                    p.setActive(false);
                    this.nextPlayer();
                    lastPos = [];
                }

                doMove = true;
            }

            if (p.ship.x == x && p.ship.y == y) {
                pirate.setXY(p.ship.x, p.ship.y);

                p.setActive(false);
                this.nextPlayer();
                lastPos = [];

                doMove = true;
            }


            if (doMove) {
                p = this.getActivePlayer();
                p.setActive(true);
                this.showMoves(p.getActiveElement(), lastPos);
            }
        });

        var player = this.getActivePlayer();
        this.render();
        this.showMoves(player.getActiveElement(), lastPos);
        this.players.forEach(p => {
            p.setActive(p == player);
        });
    }

    getActivePlayer() {
        return this.players[this.activePlayer];
    }

    showMoves(p, lastPos) {
        var card = this.getCard(p.x, p.y);
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {
                var cardForMove = this.getCard(x, y);
                if (cardForMove) {
                    var canMove = card ? card.nextMove(p, x, y, lastPos) : this.nextMove(p, x, y);                
                    var isActive = (canMove && (cardForMove.isOpen || p.goldCount == 0));

                    cardForMove.setActive(isActive, p.color);                    
                }
            }
        }

        console.log(p.waitMoves);

        this.onmove.fire(); 
    }

    nextMove(pirate, x, y) {
        return (Math.abs(pirate.x - x) == 1 && pirate.y == y) || 
               (Math.abs(pirate.y - y) == 1  && pirate.x == x);
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

        var actions = document.getElementById('actions');
        var actionBtn = m('button', 'get-money', {});
        actionBtn.disabled = true;
        actionBtn.textContent = 'Взять монету';
        actions.appendChild(actionBtn);

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

        for(let i = 0; i < 3; i++) {
            var p = m('button', 'select-pirate', {});
            p.textContent = 'Пират #' + (i + 1);
            p.addEventListener('click', () => {
                console.log(i);
                var player = this.getActivePlayer();
                player.setActiveElement(i);

                this.showMoves(player.getActiveElement(), []);
            });
            actions.appendChild(p);
        }

        var sh = m('button', 'select-ship', {});
        sh.textContent = 'Корабль';
        actions.appendChild(sh);

        this.onmove.subscribe(() => {
            var p = this.getActivePlayer().getActiveElement();
            var current = this.getCard(p.x, p.y);
            if (current && p.goldCount == 0 && current.goldCount > 0) {
                actionBtn.textContent = 'Взять монету';
                actionBtn.disabled = false;
            } else if (p.goldCount > 0) {
                actionBtn.textContent = 'Положить монету';
                actionBtn.disabled = false;
            } else {
                actionBtn.disabled = true;
            }
        });
    }
}


var root = document.getElementById('root');
let g = new GameBoard(11, 11, root);
