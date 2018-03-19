
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

export function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}