
// connect(n) - подключение n игрока  -> id игры или false
// step(x, y) - ход игрока
// onstep - ждет хода игрока возвращает координаты и состояние (с монетой, умер ...) 

export class Server {
    constructor() {
    }

    connect(name, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/connect', true);

        var body = 'name=' + encodeURIComponent(name) +
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;
            callback(JSON.parse(this.responseText));
        };
        xhr.send(body);
    }

    step(x, y) {
    }

    onstep(callback) {
    }
}