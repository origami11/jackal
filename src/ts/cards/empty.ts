import { Card, registerCard } from '../components/card';

class Empty1 extends Card {
    constructor(rotN) { super('empty_01', rotN);  }    
}

registerCard('empty_01', Empty1);

class Empty2 extends Card {
    constructor(rotN) { super('empty_02', rotN); }    
}

registerCard('empty_02', Empty2);

class Empty3 extends Card {
    constructor(rotN) { super('empty_03', rotN); }    
}

registerCard('empty_03', Empty3);

class Empty4 extends Card {
    constructor(rotN) { super('empty_04', rotN); }    
}

registerCard('empty_04', Empty4);