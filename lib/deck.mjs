//*

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

var cards = [
    ['empty_01', 10], ['empty_02', 10], ['empty_03', 10], ['empty_03', 10], 
    ['arrow_01', 3], ['arrow_02', 3], ['arrow_03', 3], ['arrow_04', 3], ['arrow_05', 3], ['arrow_06', 3], ['arrow_07', 3],  
    ['ice', 6], 
    ['girl', 1], 
    ['trap', 3], 
    ['alligator', 4], 
    ['balloon', 2], 
    ['cannibal', 1], 
    ['cannon', 2], 
    ['horse', 2], 
    ['fortress', 2], 
    ['rum', 4], 
    ['plane', 1], 
    ['gold_01', 5], ['gold_02', 5], ['gold_03', 3], ['gold_04', 2], ['gold_05', 1],
    ['rotate_2n', 5], ['rotate_3n', 4], ['rotate_4n', 2], ['rotate_5n', 1] 
];

function makeDeck(w, h, cards) {
    var count = w * h - 4;
    var sum = 0, deck = [];

    cards.forEach((card) => {
        sum += card[1];
        for(var i = 0; i < card[1]; i++) {
            deck.push([card[0], Math.round(Math.random()*3)]);
        }
    });

    return shuffle(deck);
}

export function makeRandomDeck(w, h) {
    return makeDeck(w, h, cards);
}

