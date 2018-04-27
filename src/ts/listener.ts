export class Listener {
    public list;
    constructor() {
        this.list = [];
    }

    subscribe(fn) {
        this.list.push(fn);
    }

    remove(fn) {        
    }

    send(...args) {
        for(var i = 0; i < this.list.length; i++) {
            this.list[i](...args);
        }
    }
}