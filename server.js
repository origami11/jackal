// content of index.js
const http = require('http')
var url = require('url');
var path = require('path');
var fs = require('fs');

const port = 3000;

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

class Game {
    constructor() {
        this.width = 11;
        this.height = 11;        

        this.deck = [];
        this.cards = [
            ['empty_01', 10], ['empty_02', 10], ['empty_03', 10], ['empty_03', 10], 
            ['arrow_01', 3], ['arrow_02', 3], ['arrow_03', 3], ['arrow_04', 3], ['arrow_05', 3], ['arrow_06', 3], ['arrow_07', 3],  
            ['ice', 6], 
            ['girl', 1], 
            ['trap', 3], 
            ['alligator', 4], 
            ['baloon', 2], 
            ['cannibal', 1], 
            ['cannon', 2], 
            ['horse', 2], 
            ['fortress', 2], 
            ['rum', 4], 
            ['plane', 1], 
            ['gold_01', 5], ['gold_02', 5], ['gold_03', 3], ['gold_04', 2], ['gold_05', 1],
            ['rotate_2n', 5], ['rotate_3n', 4], ['rotate_4n', 2], ['rotate_5n', 1] 
        ];

        this.makeDeck();
        this.first = null;
        this.second = null;
    }

    makeDeck() {
        var count = this.width * this.height - 4;
        var sum = 0;

        this.cards.forEach((card) => {
            sum += card[1];
            for(var i = 0; i < card[1]; i++) {
                this.deck.push([card[0], Math.round(Math.random()*3)]);
            }
        });

        this.deck = shuffle(this.deck);
    }

    setPlayer(ws) {
        if (!this.first) {
            this.first = ws
        } else if (!this.second) {
            this.second = ws
        }
    }

    clearPlayer(ws) {
        if (this.first == ws) {
            this.first = null;
        }
        if (this.second == ws) {
            this.second = null;
        }
    }

    canStart() {
        return this.first && this.second;
    }

    start() {        
        this.first.send(JSON.stringify({action: 'start', id: 1, deck: this.deck}));
        this.second.send(JSON.stringify({action: 'start', id: 2, deck: this.deck}));
    }
}

var game = new Game();
var requestCounter = 0;


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
    game.setPlayer(ws);

    if (game.canStart()) {
        game.start();
    }

    ws.on('message', function(message) {
        console.log('broadcast', message);
        // Broadcast to everyone else.
        wss.clients.forEach(function (client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function() {
        game.clearPlayer(ws);
    });
});

const requestHandler = (request, response) => {
    var requestUrl = url.parse(request.url);

    // Обработка статических ресурсов игры
    var fsPath, contentType;
    var content = {'.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.html': 'text/html'};
    
    if (requestUrl.pathname === '/') {
        fsPath = path.resolve(__dirname + '/index.html');
        contentType = {'Content-Type': 'text/html'};
    } else {
        fsPath = path.resolve(__dirname + requestUrl.pathname);
        contentType = {'Content-Type': content[path.extname(requestUrl.pathname)]};
    }

    fs.stat(fsPath, function (err, stat) {
        if (err) {
            response.end();
            return;
        }

        try {
            if (stat.isFile()) {
                response.writeHead(200, contentType);
                fs.createReadStream(fsPath).pipe(response);
            }
            else {
                response.writeHead(500);
                response.end();
            }
        }
        catch(e) {
            response.end();
        }
    });
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});
