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
    constructor(color) {
        this.pirates = [new Person(), new Person(), new Person()];
        this.ship = new Ship();
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

        this.element = m('div', 'container', {
            width: this.size + 'px',
            height: this.size + 'px'
        });

        var card = m('div', 'card', { });

        var back = m('figure', 'back', {
            backgroundImage: 'url(images/' + image + '.png)'            
        });

        var front = m('figure', 'front', {
            backgroundImage: 'url(images/default.png)'            
        });

        card.appendChild(front);
        card.appendChild(back);

        this.element.appendChild(card);

//        var angle = Math.round(Math.random()*3)*90;
//        this.element.style.transform = 'rotate('+angle+'deg)';

//        console.log(image);

        this.x = 0;
        this.y = 0;
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = (x * this.size) + 'px'
        this.element.style.top = (y * this.size) + 'px'
    }

    open() {
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
    constructor() { super('arrow_01');  }    
}

class Arrow2 extends Card {
    constructor() { super('arrow_02');  }    
}

class Arrow3 extends Card {
    constructor() { super('arrow_03');  }    
}

class Arrow4 extends Card {
    constructor() { super('arrow_04');  }    
}

class Arrow5 extends Card {
    constructor() { super('arrow_05');  }    
}

class Arrow6 extends Card {
    constructor() { super('arrow_06');  }    
}

class Arrow7 extends Card {
    constructor() { super('arrow_07');  }    
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
    constructor() { super('plane'); }    
}

class Rum extends Card {
    constructor() { super('rum'); }    
}

class Horse extends Card {
    constructor() { super('horse'); }    
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
        this.players = this.colors.map(c => new Player(c));

        this.makeDeck();    
        this.setCardXY();

        this.element = document.createElement('div');
        this.element.className = 'grid';
        this.element.style.width = cellSize * w + 'px';

        this.render();
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

        for(var i = 0; i < count-sum; i++) {  
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
        return (x == 0 && y == 0) || (x == 0 && y == this.height - 1) || (x == this.width - 1 && y == 0) || (x == this.width - 1 && y == this.height - 1);
    }

    render(id) {
        for(var i = 0; i < this.deck.length; i++) {
            var item = this.deck[i];
            this.element.appendChild(item.element);
        }
    }
}


var root = document.getElementById('root');
let g = new GameBoard(11, 11);
root.style.width = g.width * cellSize + 'px';
root.appendChild(g.element);

} ());
