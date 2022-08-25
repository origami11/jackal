// content of index.js
import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import WebSocket from 'ws';

import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const port = 3000;

class Game {
    constructor(id) {
        this.id = id;
        this.width = 11;
        this.height = 11;        
        this.messages = [];

        var gamesFile = 'data/games.json'; // Информация по настройкам игр
        var games = JSON.parse(fs.readFileSync(gamesFile, 'utf-8')); 

//        this.users = names.split(',');
        var currentGame = games.find(x => x.id == id);
        this.names = currentGame.users;

//        var num = this.users.length;
        this.numPlayers = currentGame.players; // Количество уникальных игроков
        console.log(this.names, this.numPlayers);       

        this.list = [];

        this.recFile = 'data/games/'+this.id+'/step.log'; // Лог шагов
        var deckFile = 'data/games/'+this.id+'/deck.json'; // Доска 


        this.players = [null, null, null, null];

        var dir = 'data/games/'+this.id;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        if (fs.existsSync(this.recFile)) {
            this.list = fs.readFileSync(this.recFile, 'utf-8').split('\n').filter(x => x.length > 0); 
        } else {                      
            this.list = [];
        }
        this.deck = JSON.parse(fs.readFileSync(deckFile, 'utf-8')); 
    }

    setPlayer(ws, name) {
        for(var i = 0; i < this.numPlayers; i++) {
            if (this.players[i] == null) {
                this.players[i] = {ws, name};
                break;
            }
        }
    }

    clearPlayer(ws) {
        for(var i = 0; i < this.numPlayers; i++) {
            if (this.players[i] && this.players[i].ws == ws) {
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
            this.players[i].ws.send(JSON.stringify({action: 'start', data: {user: this.names[i], id: i+1, deck: this.deck, count: this.numPlayers, players: this.names, messages: this.list}}));
        }
    }

    wait() {
        let message = JSON.stringify({target: 'all', action: 'wait', data: { active: game.getPlayers(), players: this.names }});
        this.resend('all', message, null);
    }

    getPlayers() {        
        let names = [];
        for(var i = 0; i < this.numPlayers; i++) {
            if (this.players[i] !== null) {
                names.push(this.players[i].name);
            }
        }
        return names;
    }

    login(name) {
        // Проверяем что есть свободные слоты и нужное имя
        return !this.canStart() && this.names.includes(name);
    }

    resend(target, message, ws) {
        for(var i = 0; i < this.numPlayers; i++) {
            let client = this.players[i];
            if (client && (target == 'all' ? true : client.ws !== ws) && client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(message);
            }
        }
    }
}

var game = new Game('sample');
var requestCounter = 0;

const wss = new WebSocket.Server({ port: 3001 });

function wait(client) {
    if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({action: 'login', data: {text: 'Неверный логин или нет свободных слотов для игры'}}));
    }
}

wss.on('connection', function connection(ws) {    
    ws.on('message', function(message) {
        var m = JSON.parse(message);
        console.log('message', message, m.target);
        
        if (m.action == 'login') {
            if (game.login(m.user)) {
                game.setPlayer(ws, m.user);
                if (game.canStart()) {
                    game.start();
                } else {
                    game.wait();
                }   
            } else {
                wait(ws);
            }
            return;
        }
    
        if (game.canStart()) { // Можем посылать сообщения только если есть все игроки
            game.addMessage(message)    
            // Посылаю сообщение всем
            game.resend(m.target, message, ws);
        }
    });

    ws.on('close', function() {
        game.clearPlayer(ws);
        if (!game.canStart()) { // Посылаем всем игрокам сообщение об ожидании            
            game.wait();
        }
    });
});

const requestHandler = (request, response) => {
    var requestUrl = url.parse(request.url);

    // Обработка статических ресурсов игры
    var fsPath, contentType;
    var content = {
        '.js': 'application/javascript', 
        '.css': 'text/css', 
        '.png': 'image/png',    
        '.ico': 'image/x-icon', 
        '.html': 'text/html', 
        '.jpg': 'image/jpg'
    };
    
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
    console.log(`server is listening on http://localhost:${port}`);
});
