
export function m(tag, className, style) {
    var element = document.createElement(tag);
    element.className = className;            
    for(var i in style) {
        if (style.hasOwnProperty(i)) {
            element.style[i] = style[i];
        }
    }

    return element;
}


export function h(tag, props, ...arg: any[]) {
    return {tag: tag, p: props, c: args};
}

export function patch(root, dom) {
    var el;
    if (typeof dom == 'string') {
        el = document.createTextNode(dom);
    } else {
        el = document.createElement(dom.tag);

        Object.keys(dom.p).forEach(key => {
            if (key == 'style') {
                var st = dom.p[key].style;
                Object(st).forEach(s => {
                    el.style[i] = st[i];
                })
            } else {
                el[key] = dom.p[key];
            }
            })
        
        dom.c.forEach(node => {
            patch(el, node);
        });
    }

    root.appendChild(el);
}