/* Функции для работы с dom */

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


export function h(tag, props, ...args: any[]) {
    return {tag: tag, attr: props || {}, c: args};
}

export function patch(root, dom) {
    patchNode(root, dom, root.firstChild);
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

/**
 * Простой алгоритм для vdom. Считается что элементы не меняются, а меняются только их свойства
 */
function patchNode(root, dom, cn) {
    var i = 0;
    var item = dom.length > i ? dom[i] : null;   
    
    while(item) {
        if (Array.isArray(item)) {
            cn = patchNode(root, item, cn);
        } else if (cn) {
             if (isObject(item)) {
                Object.keys(item.attr).forEach(key => {
                    if (key == 'onclick') {
                        // Пропускаем
                    } else if (key == 'style') {
                        // Пропускаем
                    } else {
                        cn[key] = item.attr[key];
                    }
                });

                patchNode(cn, item.c, cn.firstChild);
            } else {
                cn.textContent = item;
            }
            cn = cn.nextSibling;
        } else {
            renderNode(root, item);
        }
        item = dom.length > i ? dom[++i] : null;
    }
    return cn;
}

function renderNode(root, dom) {
    if (Array.isArray(dom)) {
        dom.forEach(item => renderNode(root, item));
    } else if (isObject(dom)) {
        var el = document.createElement(dom.tag);

        Object.keys(dom.attr).forEach(key => {
            var attr = dom.attr[key];
            if (key == 'onclick') {
                el.addEventListener('click', attr);
            } else if (key == 'style') {
                Object.keys(attr).forEach(s => {
                    el.style[s] = attr[s];
                });
            } else {
                el[key] = attr;
            }
        });
        
        renderNode(el, dom.c);
        root.appendChild(el);
    } else {
        root.appendChild(document.createTextNode(dom));
    }
}


