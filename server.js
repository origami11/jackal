// content of index.js
const http = require('http')
var url = require('url');
var path = require('path');
var fs = require('fs');

const port = 3000;

class Game {
    constructor() {
        this.first = null;
        this.second = null;
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
        this.first.send(JSON.stringify({action: 'start', id: 1}));
        this.second.send(JSON.stringify({action: 'start', id: 2}));
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
        console.log('message ' + message);
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
