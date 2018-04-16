﻿// content of index.js
const http = require('http')
const url = require('url');
const path = require('path');
const fs = require('fs');
var parseArgs = require('minimist');

const { makeRandomDeck } = require('./lib/deck.js');

const port = 3000;

class Game {
    constructor(id, names) {
        this.id = id;
        this.width = 11;
        this.height = 11;        
        this.messages = [];

        this.users = names.split(',');

        var num = this.users.length;
        console.log(this.users, num);

        this.list = [];
        this.numPlayers = num;

        this.recFile = 'records/'+this.id+'.txt';
        var deckFile = 'records/deck'+this.id+'.json';

        this.players = [null, null, null, null];

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
        for(var i = 0; i < this.numPlayers; i++) {
            if (this.players[i] == null) {
                this.players[i] = ws;
                break;
            }
        }
    }

    clearPlayer(ws) {
        for(var i = 0; i < this.numPlayers; i++) {
            if (this.players[i] == ws) {
                this.players[i] = null;
            }
        }
    }

    canStart() {
        for(var i = 0; i < this.numPlayers; i++) {
            if (this.players[i] == null) {
                return false;
            }
        }
        return true;
    }

    addMessage(message) {
        this.list.push(message);
        fs.appendFileSync(this.recFile, message + '\n');
    }

    start() {        
        for(var i = 0; i < this.numPlayers; i++) {
            this.players[i].send(JSON.stringify({action: 'start', data: {user: this.users[i], id: i+1, deck: this.deck, count: this.numPlayers, messages: this.list}}));
        }
    }
}

var args = parseArgs(process.argv.slice(2), {
    default: {
        gameid: new Date().getTime().toString(16),
        players: 'p1,p2',
    }
})

console.log(args);

var game = new Game(args.gameid, args.players);
var requestCounter = 0;

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
    game.setPlayer(ws);

    var start = game.canStart(); 
    console.log(start);
    if (start) {
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
    var content = {'.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.html': 'text/html', '.jpg': 'image/jpg'};
    
    if (requestUrl.pathname === '/') {
        fsPath = path.resolve(__dirname + '/public/index.html');
        contentType = {'Content-Type': 'text/html'};
    } else {
        fsPath = path.resolve(__dirname + '/public/' + requestUrl.pathname);
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
