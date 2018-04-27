import { m } from '../utils';
import { Listener } from '../listener';

export class Chat {
    list;
    root;
    user;
    onmessage: Listener;

    constructor(user, root) {
        this.user = user;
        this.root = root;

        this.onmessage = new Listener();

        this.render();
    }

    addMessage(data) {
        var msg = m('div', 'message-item', {});
        var user = m('div', 'message-user', {});
        var txt = m('div', 'message-text', {});

        var t = new Date();
        t.setTime(data.time);

        user.textContent = data.user + ' ' + t.getHours() + ':' + t.getMinutes();
        txt.textContent = data.text;

        msg.appendChild(user);
        msg.appendChild(txt);

        this.list.appendChild(msg);
    }

    render() {
        var list = this.list = m('div', 'message-list', {});
        var input = m('input', 'message-input', {});

        input.addEventListener('keypress', (event) => {
            if (event.key == 'Enter') {
                this.onmessage.send({time: (new Date()).getTime(), user: this.user, text: input.value});
                input.value = '';
            }
        });

        this.root.appendChild(list);
        this.root.appendChild(input);
    }
}
