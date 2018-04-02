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
        //console.log(JSON.parse(message));
        if (isRecord) {
            steps.push(message);
        }
        this.onmessage({data: message});
    }
}
