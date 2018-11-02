class Ship {
    constructor() {    
        this.position = new Position(0, 0);
    }
}

class Player {
    constructor() {
        this.gold = false;    
        this.position = new Position(0, 0);
    }

    move(x, y) {
        this.position.set(x, y);
        return this;
    }

    getShip() {
        return;
    }

    hasGold() {
        return this.gold;
    }

    prevPos(steps) {
        return this.position;
    }
}

class Position {
    constructor(x, y) {    
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    offset(pos, delta) {
        return Math.abs(this.x - pos.x) == delta || Math.abs(this.y - pos.y) == delta;
    }

    direct(pos, delta) {
        return (
            (Math.abs(this.x - pos.x) == delta && this.y == pos.y) 
            || (Math.abs(this.y - pos.y) == delta && this.x == pos.x)
        );
    }
}

class Game {
    constructor(gameMap) {
        this.gameMap = gameMap;
        this.rules = null;
    }    

    is(pos, type) {
        return this.gameMap[pos.y][pos.x].name == type;
    }

    isopen(pos) {
        return this.gameMap[pos.y][pos.x].open;
    }

    isfree(pos) {
        return true;
    }
}

class GameRule {
    constructor(name, options) {
        this.name = name;
        this.baseRule = null;
        this.options = options;
        this.condition = options.condition;
        this.action = options.action;
    }
}

class Card {
    constructor(name, x, y, open = true) {
        this.name = name;
        this.open = open;
        this.x = x;
        this.y = y;
    }
}

class Rules {
    constructor() {    
        this.rules = [];
    }

    addRule(name, options) {
        let rule = new GameRule(name, options);
        this.rules.push(rule);
    }

    testRules(player, game, next) {
        let result = false, rules = {};
        for(var i = 0; i < this.rules.length; i++) {
            var rule = this.rules[i];
            var valid = rule.condition(player, game, next);
            if (valid) {
                if (result) {
                    throw new Error(`Конфликт правил ${result} и ${rule.name}. Для переходов может применться только одно`);
                }
                result = rule.name;
            }

            rules[rule.name] = valid;
        }

//        if (!result) {
//            throw new Error(`Нет подходящего правила для хода`);
//        }
//        console.log(rules);
        return rules;
    }

    getRule(name) {
        for(var i = 0; i < this.rules.length; i++) {
            if (this.rules[i].name == name) {
                return this.rules[i];
            }
        }
        return false;
    }
}

let rules = new Rules();

/* Перемещение на карту */
rules.addRule('card->card', {
    condition(player, game, next) {
        let pos = player.position;
        return (
            !player.hasGold()
            && game.is(pos, 'card') 
            && game.is(next, 'card') 
            && pos.offset(next, 1) 
        );
    }, 

    action(player, next) {
        game.move(player, next);
        game.openCard(next);
    }
});

rules.addRule('gold->card', {
    condition(player, game, next) {
        let pos = player.position;
        return (
            player.hasGold() 
            && game.is(next, 'card') 
            && game.isopen(next) 
            && game.isfree(next) 
            && pos.offset(next, 1)
        );
    },

    action(player, game, next) {
        player.move(player.next);
    }
});

rules.addRule('baloon->ship', {
    active: 'entry',
    condition(player, game, next) {
        return game.is(player.position, 'baloon');
    },

    action(player, game, next) {
        player.move(player.getShip().position);
    }
});

rules.addRule('ship->card', {
    condition(player, game, next) {
        let pos = player.position;        
        return (
            game.is(pos, 'ship') 
            && game.is(next, 'card') 
            && pos.direct(next, 1)
        );
    },

    action(player, game, next) {
        player.move(next);
    }
});

rules.addRule('card->ship', {
    condition(player, game, next) {
        let pos = player.position;       
        return game.is(next, 'ship') && pos.offset(next, 1);
    }, 

    action(player, game, next) {
        player.move(player.getShip().position);
    }
});

rules.addRule('alligator', {
    active: 'entry',
    condition(player, game, next) {
        let pos = player.position;
        return game.is(pos, 'alligator');
    }, 

    action(player, game, next) {
        player.move(player.prevPos(-1));
    }
});

rules.addRule('ocean->ship', {
    condition(player, game, next) {            
        let = pos = player.position;
        return game.is(pos, 'ocean') && game.is(next, 'ship') && pos.offset(next, 1);
    },

    action(player, game, next) {
    }
});

rules.addRule('ocean->ocean', {
    condition(player, game, next) {            
        let = pos = player.position;
        return game.is(pos, 'ocean') && game.is(next, 'ocean') && pos.offset(next, 1);
    },

    action(player, game, next) {
    }
});

rules.addRule('card->ocean', {
    condition(player, game, next) {            
        return false;
    },

    action(player, game, next) {
    }
});

function makeGameMap(list, assoc) {
    var result = [];
    for(var i = 0; i < list.length; i++) {
        var item = list[i];
        result[i] = new Array();
        for(var j = 0; j < item.length; j++) {
            result[i][j] = assoc[item.charAt(j)](i, j);
        }
    }
    return result;
}

function assetRule(rules, value) {
    if (value != 'none' && !rules.hasOwnProperty(value)) {
        throw new Error(value + ' unknown rule');
    }

    for(var i in rules) {
        if (i == value && !rules[i]) {
            throw new Error(i + ' shold be true');
        }
        if (i != value && rules[i]) {
            throw new Error(i + ' shold be false');
        }
    }

    console.log('ok');
//    if (value == 'none') {
//        console.log('ok');
//    } else {
//        throw new Error(value + ' unknown rule');
//    }
}

function testRule(from, to, ruleName) {
    player.move(from[0], from[1]);
    var next = new Position(to[0], to[1]);
    var result = rules.testRules(player, game, next);

    assetRule(result, ruleName);
}

var gameArr = [
    '--ooooooooo--',
    '-oXXXXXXXXXo-',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'SXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    'oXXXXXXXXXXXo',
    '-oXXXXXXXXXo-',
    '--ooooooooo--'
];

var gameMap = makeGameMap(
    gameArr, 
    {
        'X': function (i, j) {
            return new Card('card', i, j);
        },
        'o': function (i, j) {
            return new Card('ocean', i, j);
        },
        '-': function (i, j) {
            return new Card('unknown', i, j);
        },
        'S': function (i, j) {
            return new Card('ship', i, j);
        }
    }
);

let game = new Game(gameMap);
var player = new Player();

let tests = [{
    from: [2, 2],
    to: [2, 3],
    rule: 'card->card'
}, {
    from: [2, 0],
    to: [2, 1],
    rule: 'none'
}, {
    from: [2, 0],
    to: [3, 0],
    rule: 'ocean->ocean'
},{
    from: [2, 0],
    to: [4, 0],
    rule: 'none'
},{
    from: [0, 6],
    to: [1, 6],
    rule: 'ship->card'
},{
    from: [0, 6],
    to: [1, 5],
    rule: 'none'
}];

tests.forEach(r => {
    testRule(r.from, r.to, r.rule);
});
