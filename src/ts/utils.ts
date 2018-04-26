
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
    return {tag: tag, attr: props, c: args};
}

export function patch(root, dom) {
    patchNode(root, dom);
}

/**
 * Простой алгоритм для vdom. Считается что элементы не меняются, а меняются только их свойства
 */
function patchNode(root, dom, cn == null) {
    var i = 0;
    var cn = cn || root.firstChild, item = dom.length > i ? dom[i] : null;
    
    while(cn || item) {
        if (cn) {
            if (Array.isArray(item)) {
                patchNode(root, item, cn)
            } if (typeof item == 'string') {
                cn.textContent = item;
            } else {
                Object.keys(item.attr).forEach(key => {
                    if (key == 'onclick') {
                        // Пропускаем
                    } else if (key == 'style') {
                        // Пропускаем
                    } else {
                        cn[key] = item.attr[key];
                    }
                });

                patchNode(cn, item.c);
            }
            cn = cn.nextSibling;
        } else {
            renderNode(root, item);
        }
        item = dom.length > i ? dom[++i] : null;
    }
}

function renderNode(root, dom) {
    if (Array.isArray(dom)) {
        dom.forEach(item => renderNode(root, item));
    } else if (typeof dom == 'string') {
        root.appendChild(document.createTextNode(dom));
    } else {
        var el = document.createElement(dom.tag);

        Object.keys(dom.attr).forEach(key => {
            if (key == 'onclick') {
                el.addEventListener('click', dom.p[key]);
            } else if (key == 'style') {
                var st = dom.attr[key].style;
                Object(st).forEach(s => {
                    el.style[i] = st[i];
                });
            } else {
                el[key] = dom.attr[key];
            }
        });
        
        renderNode(el, dom.c);
        root.appendChild(el);
    }
}

