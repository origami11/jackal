
export class DeckGenerator {
    constructor(w, h) {
        this.width = w;
        this.height = h;
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
        this.makeDeck();    
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

        this.deck = shuffle(this.deck);
    }
}
