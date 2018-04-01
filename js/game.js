//"use strict";
import { m } from './utils.js';
import { makeRandomDeck } from './game/deck.js';
import { Listener } from './listener.js';

import { Card } from './components/card.js';
import { Player } from './components/player.js';

import { cellSize } from './options.js';

import { Server } from './server.js';

import { Arrow1, Arrow2, Arrow3, Arrow4, Arrow5, Arrow6, Arrow7 } from './cards/arrows.js';
import { Rotate2n, Rotate3n, Rotate4n, Rotate5n } from './cards/rotates.js';
import { Empty1, Empty2, Empty3, Empty4 } from './cards/empty.js';
import { Gold1, Gold2, Gold3, Gold4, Gold5 } from './cards/golds.js';
import { Ice, Trap, Alligator, Balloon, Cannon, Default, Girl,  Plane, Rum, Horse,  Fortress, Cannibal } from './cards/specials.js';

var gameMap = [
    '--ooooooooo--',
    '-oXXXXXXXXXo-',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    '-oXXXXXXXXXo-',
    '--ooooooooo--'
];

function deckFromList(list) {
    var cardsMap = {
        'empty_01': Empty1, 'empty_02': Empty2, 'empty_03': Empty3, 'empty_03': Empty4, 
        'arrow_01': Arrow1, 'arrow_02': Arrow2, 'arrow_03': Arrow3, 'arrow_04': Arrow4, 'arrow_05': Arrow5, 'arrow_06': Arrow6, 'arrow_07': Arrow7,  
        'ice': Ice, 
        'girl': Girl, 
        'trap': Trap, 
        'alligator': Alligator, 
        'baloon': Balloon, 
        'cannibal': Cannibal, 
        'cannon': Cannon, 
        'horse': Horse, 
        'fortress': Fortress, 
        'rum': Rum, 
        'plane': Plane, 
        'gold_01': Gold1, 'gold_02': Gold2, 'gold_03': Gold3, 'gold_04': Gold4, 'gold_05': Gold5,
        'rotate_2n': Rotate2n, 'rotate_3n': Rotate3n, 'rotate_4n': Rotate4n, 'rotate_5n': Rotate5n 
    };
    return list.map((item, i) => {
        var card = new cardsMap[item[0]](item[1]);
        card.ID = i;
        return card;
    });
}

class GameBoard {  
    constructor(w, h, root, list, id, count) {
        this.id = id;
        this.width = w;
        this.height = h;
        this.colors = ['white', 'red', 'yellow', 'green'];
        this.onmove = new Listener();
        this.count = count;

        this.deck = deckFromList(list);

        this.activePlayer = 0;
        this.players = [
            new Player(-1, 5, '#D32F2F', 0), 
            new Player(5, -1, '#FBC02D', 1),
            new Player(11, 5, '#388E3C', 2), 
            new Player(5, 11, '#0288D1', 3) 
        ];

        this.players[0].friends = [this.players[2]];
        this.players[1].friends = [this.players[3]];
        this.players[2].friends = [this.players[0]];
        this.players[3].friends = [this.players[1]];

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

        this.lastPos = [];

        this.element.addEventListener('click', (event) => {
            var x = Math.floor((event.clientX - this.element.offsetLeft) / cellSize) - 1;
            var y = Math.floor((event.clientY - this.element.offsetTop) / cellSize) - 1;

                        
            var player = this.activePlayer;
            if (this.isActivePlayer(player)) {
                if (this.applyUserStep(x, y)) {
                    sendMessage('step', {player: player, x: x, y: y}, 'other');
                }
            }
        });

        this.render();

        var player = this.getActivePlayer();
        this.showMoves(player, player.getActiveElement(), this.lastPos);
        this.players.forEach(p => {
            p.setActive(p == player);
        });
    }

    isActivePlayer(player) {
        if (this.count == 4) {
            return (this.id == 1 && player == 0) || (this.id == 2 && player == 1) || (this.id == 3 && player == 2) || (this.id == 4 && player == 3);
        }
        if (this.count == 3) {
            return (this.id == 1 && [1, 3].indexOf(player) >= 0) || (this.id == 2 && player == 0) || (this.id == 3 && player == 2);
        }
        if (this.count == 2) {
            return this.id == 1 && [1, 3].indexOf(player) >= 0 || this.id == 2 && [0, 2].indexOf(player) >= 0;
        }
        return true;
    }

    getEnemyPlayers(player) {
        return ([1, 3].indexOf(player) >= 0) ? [0, 2] : [1, 3];
    }

    hasEnemyPirates(card) {
        var x = card.x, y = card.y;
        var enemy = this.getEnemyPlayers(this.activePlayer);
        return enemy.some(n => this.players[n].hasPirateXY(x, y));
    }

    forEachEnemy(card, fn) {
        var x = card.x, y = card.y;
        var enemy = this.getEnemyPlayers(this.activePlayer);
        for(var i = 0; i < enemy.length; i++) {
            var n = enemy[i];
            this.players[n].pirates.forEach(p => {
                if (p.matchXY(x, y)) {
                    fn(this.players[n], p);
                }
            })
        };
    }

    allowMoveToCard(player, pirate, current, next, lastPos, x, y) {
        // Пират может передвигаться на карту 1. У него нет золота 2. Карта открыта
        let canMoveTo = next && next.allowMove(pirate);
        // Пират может передвигаться на карту если на ней стоит пират и у текущего пирата нет монеты или это специальная клетка                
        let canAttack = next ? next.allowWithPirates || (this.hasEnemyPirates(next) ? pirate.goldCount == 0 : true) : true;

        // Передвигаемся с суши
        if (current) {            
            return current.nextMove(pirate, x, y, lastPos) && // Может ходить с текущей клетки на указанную позицию
                (pirate.goldCount == 0 || current.allowWithGold) && // Пират может передвигаться на карту если на нее можно ходит с золотом
                canAttack &&
                canMoveTo; // И на клетку разрешено ходить
        } else 
        // Передвигаемся с корабля
        if (player.pirateOnShip(pirate) && this.nextMove(pirate, x, y)) {
            return canMoveTo;
        }
        // Передвигаемся по воде

        return false; 
    }

    allowMoveToShip(p, pirate, current, lastPos, x, y) {
        // Передвигаемся на корабль
        return p.ship.x == x && p.ship.y == y && 
            ((Math.abs(pirate.x - p.ship.x) <= 1 && Math.abs(pirate.y - p.ship.y) <= 1) || current.image == 'balloon' || (current && current.nextMove(pirate, x, y, lastPos))) && 
            (pirate.x != p.ship.x || pirate.y != p.ship.y);
    }

    allowMoveToOcean(pirate, current, lastPos, x, y) {
        // Пират на острове
        if (current) {
            return current.allowToOcean && current.nextMove(pirate, x, y, lastPos);
        }
        // Пират вне острова
        var sx = x + 1;
        var sy = y + 1;
        return (Math.abs(pirate.x - x) <= 1 && Math.abs(pirate.y - y) <= 1) && sx >= 0 && sy >= 0 && sx < gameMap.length && sy < gameMap[sx].length && gameMap[sx].charAt(sy) == 'o';
    }

    applyUserStep(x, y) {
        var player = this.getActivePlayer();

        if (player.moveShip) {
            // Добавить условие встречи корабля и пирата
            if (player.setShipXY(x, y)) {
                player.moveShip = false;
                return this.nextLoop(true);
            }

            return false;
        }

        var next = this.getCard(x, y);
        var pirate = player.getActiveElement();

        if (pirate.isDead || !pirate.allowMove()) {
            return false;
        }

        var current = this.getCard(pirate.x, pirate.y);
        // Передвижение на другую клетку
        if (this.allowMoveToCard(player, pirate, current, next, this.lastPos, x, y)) {
            console.log('card');
            next.flip();
            this.lastPos.push({x: pirate.x, y: pirate.y, card: current});

            // Атака на пирата
            if (!next.allowWithPirates && this.hasEnemyPirates(next)) {
                this.forEachEnemy(next, (player, pirate) => {
                    pirate.resetMoves();
                    if (pirate.goldCount > 0) {
                        sendMessage('setgold', {
                            player: player.ID, 
                            pirate: pirate.ID, 
                            gold: 0 
                        }, 'self');
                        sendMessage('cardgold', {card: next.ID, gold: next.goldCount + 1}, 'self');
                    }
                    sendMessage('setxy', {
                        player: player.ID,    
                        pirate: pirate.ID, 
                        x: player.ship.x, 
                        y: player.ship.y
                    }, 'self');
                });
            }

            if (next.image == 'cannibal') {
                pirate.resetMoves();
                sendMessage('setgold', {
                    player: player.ID, 
                    pirate: pirate.ID, 
                    gold: 0 
                }, 'self');
                pirate.setDead();
            } else {
                next.updatePos(pirate);

                sendMessage('setxy', {
                    player: player.ID, 
                    pirate: pirate.ID, 
                    x: next.x, 
                    y: next.y
                }, 'self');
            }

            return this.nextLoop(!next.repeatMove);
        }  else 
        // Добавить встречу с кораблем врага и друга            
        // Передвижение с клетки на корабль (только если пират рядом), но не на карабле
        if (this.allowMoveToShip(player, pirate, current, this.lastPos, x, y)) { 
            console.log('ship');
//            this.setXY(pirate, player.ship.x, player.ship.y);
            sendMessage('setxy', {
                player: player.ID, 
                pirate: pirate.ID, 
                x: x, 
                y: y
            }, 'self');

            // shipgold
            player.ship.setGoldCount(player.ship.goldCount + pirate.goldCount);

            sendMessage('setgold', {
                player: player.ID, 
                pirate: pirate.ID, 
                gold: 0 
            }, 'self');
            return this.nextLoop(true);
        } else
        // Передвижение на воду 
        if (this.allowMoveToOcean(pirate, current, this.lastPos, x, y)) {
            console.log('ocean');
            sendMessage('setxy', {
                player: player.ID, 
                pirate: pirate.ID, 
                x: x, 
                y: y
            }, 'self');
            sendMessage('setgold', {
                player: player.ID, 
                pirate: pirate.ID, 
                gold: 0 
            }, 'self');
            return this.nextLoop(true);
        }

        return false;
    }

    nextLoop(nextPlayer) {
        var player = this.getActivePlayer();
        player.setActive(false);
        if (nextPlayer) {
            this.nextPlayer();
            this.lastPos = [];        
            player = this.getActivePlayer();
            player.setActive(true);    
        }
        this.showMoves(player, player.getActiveElement(), this.lastPos);
        return true;
    }

    getActivePlayer() {
        return this.players[this.activePlayer];
    }

    showMoves(player, pirate, lastPos) {
        var card = this.getCard(pirate.x, pirate.y);
        for(var x = 0; x < this.width; x++) {
            for(var y = 0; y < this.height; y++) {
                var next = this.getCard(x, y);
                if (next) {
                    next.setActive(!pirate.isDead && pirate.allowMove() && this.allowMoveToCard(player, pirate, card, next, lastPos, x, y), pirate.color);
                }
            }
        }

        this.onmove.fire(); 
    }

    setXY(pirate, x, y) {
        var p = pirate;
        if (p.x != x || p.y != y) {
            // Событие при котром мы покидаем карту
            if (p.card) {
                p.card.leaveCard(p);
            }

            p.setXY(x, y);         
            // Событие которое происходит когда пират вступает на карту   
            var card = g.getCard(x, y);
            if (card) {
                card.enterCard(p);
            }
            p.card = card;            
        }            
    }

    nextMove(pirate, x, y) {
        return (Math.abs(pirate.x - x) == 1 && pirate.y == y) || 
               (Math.abs(pirate.y - y) == 1 && pirate.x == x);
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

    switchPirate(i) {
        var player = this.getActivePlayer();
        player.moveShip = false;
        var pirate = player.pirates[i];
        if (pirate.isDead) {
            var r = player.canBeResurected(pirate);
            if (r) {
                pirate.setLive(r.card.x, r.card.y);

                // Переход хода при воскрешении пирата
                player.setActive(false);
                this.nextPlayer();
                this.lastPos = [];            
                this.updateMove(this.lastPos);
            }                        
        } else if (player.pirates[i].allowMove()) {
            player.setActiveElement(i);
            this.showMoves(player, player.getActiveElement(), []);
        }
    }

    switchShip() {
        var player = this.getActivePlayer();
        player.moveShip = true;
    }

    switchGold() {
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
    
        this.showMoves(player, p, []);
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
            sendMessage('gold', {player: this.activePlayer}, 'all');
        });

        var pirateBtn = [];
        for(let i = 0; i < 3; i++) {
            var p = m('button', 'select-pirate', {});
            p.textContent = 'Пират #' + (i + 1);
            p.addEventListener('click', () => {              
                sendMessage('pirate', {player: this.activePlayer, pirate: i}, 'all');
            });
            actions.appendChild(p);
            pirateBtn.push(p);
        }

        var sh = m('button', 'select-ship', {});
        sh.textContent = 'Корабль';
        sh.addEventListener('click', () => {
            sendMessage('ship', {player: this.activePlayer}, 'all');  
        });

        actions.appendChild(sh);

        /*var die = m('button', 'die-ship', {});
        die.textContent = 'Умереть';
        die.addEventListener('click', () => {
            var player = this.getActivePlayer();
            var pirate = player.getActiveElement();

            sendMessage('die', {player: player.ID, pirate: pirate.ID});  
        });
        actions.appendChild(die);*/

        this.onmove.subscribe(() => {
            var player = this.getActivePlayer()
            var p = player.getActiveElement();

            if (!this.isActivePlayer(this.activePlayer)) {
                actions.style.display = 'none';
                return;
            }
            actions.style.display = 'block';

            for(var i = 0; i < pirateBtn.length; i++) {
                pirateBtn[i].textContent = player.pirates[i].getStatusName();
            }

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


var isRecord = false;
var steps = [];
window.startRecord = function () {
    isRecord = true;
    steps = [];
}
window.stopRecord = function () {
    isRecord = false;
    localStorage.setItem('game', JSON.stringify(steps));
}
window.playRecord = function () {
    var n = JSON.parse(localStorage.getItem('game'));
            
    if (n) {
        n.forEach(message => socket.send(message));
    }
}

class FakeWebSocket {
    constructor(url) {
        this.onopen = null;
        this.onmessage = null;
//        this.deck = makeRandomDeck(11, 11);
        fetch('./deck.json').then(r => r.json()).then((data) => {
            this.deck = data;
            setTimeout(() => {
                this.onopen(null);
                this.serverSend(JSON.stringify({action: 'start', data: {id: 1, deck: this.deck, count: 1, messages: []}}));
            }, 100);
        })
    }

    serverSend(message) {
        this.onmessage({data: message});
    }

    send(message) {        
        console.log(JSON.parse(message));
        if (isRecord) {
            steps.push(message);
        }
        this.onmessage({data: message});
    }
}

let g = null;
var actions = {
    // Начинаем игру
    'start': (data) => {
        // Создаем игровое поле
        if (!g) {
            var root = document.getElementById('root');
            g = new GameBoard(11, 11, root, data.deck, data.id, data.count);
            // Воспроизводим ранее записанные действия
            var list = data.messages;
            list.forEach(m => processMessages({data: m}));
        }
    },
    // Переключаемсся на корабль
    'ship': (data) => {
        g.switchShip();
    },
    // Сбрасывает состояние игрока
    'reset': (data) => {
        var p = g.players[data.player].pirates[data.pirate];
        p.resetMoves();
    },
    // Взять или положить золото
    'gold': (data) => {
        g.switchGold();
    },
    // Переключится на пирата pirate=ID, ID in [1, 2, 3]
    'pirate': (data) => {
        g.switchPirate(data.pirate);
    },
    // Сделать ход на клетку с координатами
    'step': (data) => {
        g.applyUserStep(data.x, data.y);
    },
    // Переместить пирата на клетку с кординатами x,y 
    'setxy': (data) => {
        var p = g.players[data.player].pirates[data.pirate];
        g.setXY(p, data.x, data.y);
    },
    // Устанавливает количество золота у пирата gold
    'setgold': (data) => {
        var p = g.players[data.player].pirates[data.pirate];
        p.setGoldCount(data.gold);
    },
    // Устанавливает количество золота у карты gold
    'cardgold': (data) => {
        g.deck[data.card].setGoldCount(data.gold);
    },
    // Ход следующего игрока        
    'next': (data) => {
        g.nextLoop(true);
    },
    // Умираем и передаем ход
    'die': (data) => {
        var p = g.players[data.player].pirates[data.pirate];
        p.setDead();
        g.nextLoop(true);
    },
    // Открыть карту
    'flipcard': (data) => {
        var card = g.getCard(data.x, data.y);
        card.flip();
    },
    // Открыть все карты
    'flipall': (data) => {
        g.deck.forEach(card => card.flip());
    },
    // Поменять карты местами
    'swapcard': (data) => {
        var from = data.from;
        var to = data.to;
        var cfrom = g.getCard(from.x, from.y);
        var cto = g.getCard(to.x, to.y);
        cfrom.setXY(to.x, to.y);
        cto.setXY(from.x, from.y);
    }
}

function processMessages(event) {
    var msg = JSON.parse(event.data);
    console.log(msg);
    var action = msg.action;        
    var data = msg.data;        
    if (actions.hasOwnProperty(action)) {
        actions[action](data);
    }    
}

function sendMessage(name, data, target = 'all') {
    var msg = JSON.stringify({action: name, data: data, target: target});
    if (target == 'self') {
        processMessages({data: msg});
    } else {
        socket.send(msg);
    }
}

window.sendActive = function (name, props = {}, tagret = 'all') {
    var player = g.getActivePlayer();
    var pirate = player.getActiveElement();
    props = Object.assign(props, {player: player.ID, pirate: pirate.ID});
    sendMessage(name, props, tagret);
}

window.msgList = Object.keys(actions);

var socket = window.debugGame ?
new FakeWebSocket("ws://"+window.location.hostname+":3001")
: new WebSocket("ws://"+window.location.hostname+":3001");

socket.onmessage = processMessages;
socket.onopen = function (event) {
    console.log('wait');
};
