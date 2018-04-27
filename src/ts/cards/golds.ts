import { Card, registerCard } from '../components/card';

class Gold1 extends Card {
    constructor(rotN) { 
        super('gold_01', rotN); 
        this.setGoldCount(1);
    }    
}

registerCard('gold_01', Gold1);

class Gold2 extends Card {
    constructor(rotN) { 
        super('gold_02', rotN); 
        this.setGoldCount(2);
    }    
}

registerCard('gold_02', Gold2);

class Gold3 extends Card {
    constructor(rotN) { 
        super('gold_03', rotN); 
        this.setGoldCount(3);
    }    
}

registerCard('gold_03', Gold3);

class Gold4 extends Card {
    constructor(rotN) { 
        super('gold_04', rotN); 
        this.setGoldCount(4);
    }    
}

registerCard('gold_04', Gold4);

class Gold5 extends Card {
    constructor(rotN) { 
        super('gold_05', rotN); 
        this.setGoldCount(5);
    }    
}

registerCard('gold_05', Gold5);