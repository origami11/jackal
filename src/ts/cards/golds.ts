import { Card } from '../components/card.js';

export class Gold1 extends Card {
    constructor(rotN) { 
        super('gold_01', rotN); 
        this.setGoldCount(1);
    }    
}

export class Gold2 extends Card {
    constructor(rotN) { 
        super('gold_02', rotN); 
        this.setGoldCount(2);
    }    
}

export class Gold3 extends Card {
    constructor(rotN) { 
        super('gold_03', rotN); 
        this.setGoldCount(3);
    }    
}

export class Gold4 extends Card {
    constructor(rotN) { 
        super('gold_04', rotN); 
        this.setGoldCount(4);
    }    
}

export class Gold5 extends Card {
    constructor(rotN) { 
        super('gold_05', rotN); 
        this.setGoldCount(5);
    }    
}
