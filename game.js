(function () {

const cellSize = 72;
//const cellSize = 164;

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

class Person {
    constrcutor() {
        this.x = 0;
        this.y = 0;
        this.money = 0;

        this.localMove = 0;
    }    

    move() {        
    }
}

class Ship {
    constrcutor() {
        this.side = 0;
        this.position = 4;
    }

    move() {
    }
}

class Player {
    constructor(x, y, color) {    

        this.element = m('div', 'player', {
            width: cellSize + 'px',
            height: cellSize + 'px'
        });

        this.image = m('div', 'player-image', {
            background: color
        });

        this.element.appendChild(this.image);

        this.setXY(x, y);
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = (x * cellSize) + 'px'
        this.element.style.top = (y * cellSize) + 'px'
    }
}

function m(tag, className, style) {
    var element = document.createElement(tag);
    element.className = className;            
    for(var i in style) {
        if (style.hasOwnProperty(i)) {
            element.style[i] = style[i];
        }
    }

    return element;
}

class Card {    
    constructor(image) {
        this.size = cellSize;
        this.isOpen = false;
        this.repeatMove = false;

        this.element = m('div', 'container', {
            width: this.size + 'px',
            height: this.size + 'px'
        });

        this.card = m('div', 'card', { });

        var back = m('figure', 'back', {
            width: (this.size - 2) + 'px',
            height: (this.size - 2) + 'px',
            top: '1px',
            left: '1px',
            backgroundImage: 'url(images/' + image + '.png)'            
        });

        var front = m('figure', 'front', {
            width: (this.size - 2) + 'px',
            height: (this.size - 2) + 'px',
            top: '1px',
            left: '1px',
            backgroundImage: 'url(images/default.png)'            
        });

        this.card.appendChild(front);
        this.card.appendChild(back);

        this.element.appendChild(this.card);

        this.card.addEventListener("transitionend", () => {
            this.element.style.zIndex = 1;
        }, false);

//        var angle = Math.round(Math.random()*3)*90;
//        this.element.style.transform = 'rotate('+angle+'deg)';

        this.x = 0;
        this.y = 0;
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = (x * this.size) + 'px'
        this.element.style.top = (y * this.size) + 'px'
    }

    nextMove(pirate, x, y) {
        return (Math.abs(pirate.x - x) <= 1 && Math.abs(pirate.y - y) <= 1);
    }

    updatePos(pirate) {
        pirate.setXY(this.x, this.y);
    }

    setActive(flag) {
        if (flag) {
            this.element.classList.add('active');
        } else {
            this.element.classList.remove('active');;
        }
    }

    flip() {
        if (!this.isOpen) {
            this.isOpen = true;
            this.element.style.zIndex = 100;
            this.card.classList.add('flipped');
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
        return (pirate.x + 1 == x && pirate.y == y)
            || (pirate.x - 1 == x && pirate.y == y);
    }   
}

class Arrow4 extends Card {
    constructor() { 
        super('arrow_04');  
        this.repeatMove = true;
    }

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y + 1 == y)
            || (pirate.x + 1 == x && pirate.y - 1 == y);
    }    
}

class Arrow5 extends Card {
    constructor() { 
        super('arrow_05');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y - 1 == y)
            || (pirate.x + 1 == x && pirate.y == y)
            || (pirate.x  == x && pirate.y + 1 == y);
    }
}

class Arrow6 extends Card {
    constructor() { 
        super('arrow_06');  
        this.repeatMove = true;
    }    

    nextMove(pirate, x, y) {
        return (pirate.x - 1 == x && pirate.y == y)
            || (pirate.x + 1 == x && pirate.y == y)
            || (pirate.x == x && pirate.y + 1 == y)
            || (pirate.x == x && pirate.y - 1 == y);
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
    constructor() { super('ice'); }    
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
    constructor() { super('gold_01'); }    
}

class Gold2 extends Card {
    constructor() { super('gold_02'); }    
}

class Gold3 extends Card {
    constructor() { super('gold_03'); }    
}

class Gold4 extends Card {
    constructor() { super('gold_04'); }    
}

class Gold5 extends Card {
    constructor() { super('gold_05'); }    
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

class GameBoard {  
    constructor(w, h) {
        this.width = w;
        this.height = h;
        this.colors = ['white', 'red', 'yellow', 'green'];

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

        this.element = m('div', 'grid', {width: cellSize * w + 'px'});
        this.element.addEventListener('click', (event) => {
            var x = Math.floor((event.clientX - this.element.offsetLeft) / cellSize);
            var y = Math.floor((event.clientY - this.element.offsetTop) / cellSize);

            var next = this.getCard(x, y);
            var p = this.players[this.activePlayer];
            var current = this.getCard(p.x, p.y);

            if ((next && current && current.nextMove(p, x, y)) 
                || (next && !current && this.nextMove(p, x, y))) {

                next.flip();
                next.updatePos(p);

                // p.setXY(x, y);
                if (!next.repeatMove) {
                    this.nextPlayer();
                }
                this.showMoves(this.players[this.activePlayer]);
            }
        });

        this.render();
    }

    showMoves(p) {
        var card = this.getCard(p.x, p.y);
        if (card) {
            for(var x = 0; x < this.width; x++) {
                for(var y = 0; y < this.height; y++) {
                    var c = this.getCard(x, y);
                    if (c) {
                        c.setActive(card.nextMove(p, x, y));
                    }
                }
            }
        } else {
            for(var x = 0; x < this.width; x++) {
                for(var y = 0; y < this.height; y++) {
                    var c = this.getCard(x, y);
                    if (c) {
                        c.setActive(this.nextMove(p, x, y));
                    }
                }
            }
        }
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
            this.element.appendChild(item.element);
        })

        this.players.forEach(item => {
            this.element.appendChild(item.element);
        })
    }
}


var root = document.getElementById('root');
let g = new GameBoard(11, 11);
root.style.width = g.width * cellSize + 'px';
root.appendChild(g.element);

} ());
