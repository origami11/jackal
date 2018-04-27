//"use strict";
import { m, h, patch } from './utils';
import { Listener } from './listener';

import { Card, createCard } from './components/card';
import { Player } from './components/player';
import { Chat } from './components/chat';
import { cellSize } from './options';

import './cards/cardset.js';

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
    return list.map((item, i) => {
        var card = createCard(item[0], item[1]);
        card.ID = i;
        return card;
    });
}

class GameBoard {  
    public activePlayer;
    public lastPos: Array<any>;
    public deck: Array<Card>;
    public players: Array<Player>;

    /* Номер игрока */
    public id;
    /* Количество игроков */
    public count; 
    public users = [];
    
    /* Размеры поля */
    public width;
    public height;
    
    private grid: HTMLDivElement;
    private nodeInfo: HTMLDivElement;
    private nodeActions: HTMLDivElement;
    private root: HTMLDivElement;
    public element: HTMLDivElement;

    public onmove: Listener;

    constructor(w, h, root, list, id, count, users, name) {

        this.nodeInfo = document.getElementById('info');
        this.nodeActions = document.getElementById('actions');
        this.root = root;

        this.id = id;
        this.width = w;
        this.height = h;
        this.onmove = new Listener();

        this.count = count;
        this.users = users;
        this.name = name;

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

        this.lastPos = [];
    
        this.onmove.subscribe(() => {
            patch(this.nodeInfo, this.renderInfo());
            patch(this.nodeActions, this.renderActions());
        });

        this.render();
    }

    isActivePlayer(player) {
        if (this.count == 4) {
            return (this.id == 1 && player == 0) || (this.id == 2 && player == 1) || (this.id == 3 && player == 2) || (this.id == 4 && player == 3);
        }
        if (this.count == 3) {
            return (this.id == 1 && [0, 2].indexOf(player) >= 0) || (this.id == 2 && player == 1) || (this.id == 3 && player == 3);
        }
        if (this.count == 2) {
            return this.id == 1 && [0, 2].indexOf(player) >= 0 || this.id == 2 && [1, 3].indexOf(player) >= 0;
        }
        return true;
    }

    getEnemyPlayers(player) {
        return ([1, 3].indexOf(player) >= 0) ? [0, 2] : [1, 3]; // проверить id и friends
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

            // leaveCard(card) + enterCard(next)
            if (next.image == 'cannibal') {
                pirate.resetMoves();
                sendMessage('setgold', {
                    player: player.ID, 
                    pirate: pirate.ID, 
                    gold: 0 
                }, 'self');
                pirate.setDead();
            } else {
                next.nextStep(pirate);

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
            sendMessage('setxy', {
                player: player.ID, 
                pirate: pirate.ID, 
                x: x, 
                y: y
            }, 'self');

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

        this.onmove.send(); 
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
                this.nextLoop(true);
            }                        
        } else if (player.pirates[i].allowMove()) {
            player.setActiveElement(i);
            this.showMoves(player, player.getActiveElement(), []);
        }
    }

    switchShip() {
        var player = this.getActivePlayer();
        player.moveShip = true;

        this.onmove.send();
    }

    switchGold() {
        var player = this.getActivePlayer();
        var p = player.getActiveElement();
        var current = this.getCard(p.x, p.y);
    
        if (current && p.goldCount == 0 && current.goldCount > 0) {
            current.setGoldCount(current.goldCount - 1);
            p.setGoldCount(1);
        } else if (current && p.goldCount > 0) {
            current.addGold(this.lastPos);
            p.setGoldCount(0);
        } else if (p.goldCount > 0 && player.pirateOnShip(p)) {
            player.ship.addGold();
            p.setGoldCount(0);
        }
    
        this.showMoves(player, p, []);
    }

    onBoardClick = (event) => {
        var x = Math.floor((event.clientX - this.element.offsetLeft) / cellSize) - 1;
        var y = Math.floor((event.clientY - this.element.offsetTop) / cellSize) - 1;
                    
        var player = this.activePlayer;
        if (this.isActivePlayer(player)) {
            if (this.applyUserStep(x, y)) {
                sendMessage('step', {player: player, x: x, y: y}, 'other');
            }
        }
    }

    renderInfo() {
        return this.players.map(item => {
            console.log('ship', item.moveShip);
            return h('div', {
                    className: 'player-info' + (this.activePlayer == item.ID ? ' active-player' : '')                    
                }, 
                item.pirates.map(p =>
                    h('div', {className: 'info-pirate ' + (!item.moveShip ? p.getStatus() : ''), style: { background: item.color }}, p.ID + 1)
                ),
                h('div', {className: 'info-ship' + (item.moveShip ? ' status-active' : ''), style: { background: item.color }}, 'S'),
                h('div', {className: 'info-name'}, this.users[item.ID])
            )
        });
    }

    renderActions() {
        var player = this.getActivePlayer()
        var p = player.getActiveElement();

        var current = this.getCard(p.x, p.y);
        if (current && p.goldCount == 0 && current.goldCount > 0) {
            var text = 'Взять монету';
            var disabled = false;
        } else if (p.goldCount > 0) {
            var text = 'Положить монету';
            var disabled = false;
        } else {
            var text = 'Взять монету';
            var disabled = true;
        }

        return [
            h('div', {className: 'action-name'}, this.name),
            h('div', {className: 'action-list' + (this.isActivePlayer(this.activePlayer) ? ' action-active': '')},
                h('button', {
                    className: 'get-money',
                    onclick: () => {
                        sendMessage('gold', {player: this.activePlayer}, 'all');
                    },
                    disabled: disabled
                }, text),
    
                [0, 1, 2].map(n => 
                    h('button', {
                        className: 'select-pirate',
                        onclick: () => {              
                            sendMessage('pirate', {player: this.activePlayer, pirate: n}, 'all');
                        }
                    }, 'Пират #' + (n + 1))
                ),
    
                h('button', {
                    className: 'select-ship',
                    onclick: () => {
                        sendMessage('ship', {player: this.activePlayer}, 'all');  
                    }
                }, 'Корабль')
            )
        ];
    }

    render() {
        var w = this.width;
        var h = this.height;
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
        this.root.style.width = cellSize * (w + 2) + 'px';
        this.root.style.height = cellSize * (h + 2) + 'px';
        this.root.appendChild(this.element);
      
        this.deck.forEach(item => {
            this.grid.appendChild(item.element);
        });

        this.players.forEach(player => {
            player.pirates.forEach(pirate => {
                this.grid.appendChild(pirate.element);
            });
            this.grid.appendChild(player.ship.element);
        });

        this.element.addEventListener('click', this.onBoardClick);

        var player = this.getActivePlayer();
        this.showMoves(player, player.getActiveElement(), this.lastPos);

        this.players.forEach(p => { p.setActive(p == player); });

        patch(this.nodeInfo, this.renderInfo());
        patch(this.nodeActions, this.renderActions());
    }
}

let g: GameBoard = null;
let chat: Chat = null;

var actions = {
    // Начинаем игру
    'start': (data) => {
        // Создаем игровое поле
        if (!g) {
            var root = document.getElementById('root');
            g = new GameBoard(11, 11, root, data.deck, data.id, data.count, data.players, data.user);
            // Воспроизводим ранее записанные действия
            var chatRoot = document.getElementById('chat');
            chat = new Chat(data.user, chatRoot);
            chat.onmessage.subscribe((data) => {
                sendMessage('chat', data);
            });

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
    },
    'chat': (data) => {
        chat.addMessage(data);
    },
}

function processMessages(event) {
    var msg = JSON.parse(event.data);
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

var socket = new WebSocket("ws://"+window.location.hostname+":3001");

socket.onmessage = processMessages;
socket.onopen = function (event) {
    console.log('wait');
};
