// content of index.js
const http = require('http')
const url = require('url');
const path = require('path');
const fs = require('fs');

const { makeRandomDeck } = require('./lib/deck.js');

const port = 3000;

class Game {
    constructor(id) {
        this.id = id;
        this.width = 11;
        this.height = 11;        

        this.list = [];

        this.first = null;
        this.second = null;

        this.recFile = 'records/'+this.id+'.txt';
        var deckFile = 'records/deck'+this.id+'.json';

        if (fs.existsSync(this.recFile)) {
            this.list = fs.readFileSync(this.recFile, 'utf-8').split('\n').filter(x => x.length > 0); 
            this.deck = JSON.parse(fs.readFileSync(deckFile, 'utf-8')); 
        } else {
            this.deck = makeRandomDeck(this.width, this.height);
            fs.writeFileSync(deckFile, JSON.stringify(this.deck)); 
            this.list = [];
        }
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

    addMessage(message) {
        this.list.push(message);
        fs.appendFileSync(this.recFile, message + '\n');
    }

    start() {        
        this.first.send(JSON.stringify({action: 'start', data: {id: 1, deck: this.deck, count: 2, messages: this.list}}));
        this.second.send(JSON.stringify({action: 'start', data: {id: 2, deck: this.deck, count: 2, messages: this.list}}));
    }
}

var args = process.argv, gameid = 0;;
if (args.length >= 3) {
    gameid = args[2];
} else {
    gameid = new Date().getTime().toString(16)
}

var game = new Game(gameid);
var requestCounter = 0;

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
    game.setPlayer(ws);

    if (game.canStart()) {
        game.start();
    }

    ws.on('message', function(message) {
        game.addMessage(message)
        var m = JSON.parse(message);
        console.log('broadcast', message, m.target);        
        // Посылаю сообщение всем
        wss.clients.forEach(function (client) {
            if ((m.target == 'all' ? true : client !== ws) && client.readyState === WebSocket.OPEN) {
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
