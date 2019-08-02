
import _ from 'lodash';
import { cube } from './math.js';
require('./main.css');

if (process.env.NODE_ENV !== 'production') {
    console.log('looks like we are in development mode!');
} else {
    console.log('looks like we are in production mode!');
}
console.log('当前所处环境', process.env.NODE_ENV);

// import Print from './print';
console.log(_.join(['Another', 'module', 'loaded!'], ''));

function component() {
    console.log('=============start=================');
    var element = document.createElement('pre');

    element.innerHTML = ['hello webpack', '5 cubed is equal to ' + cube(5)].join('\n\n');

    // element.onclick = Print.bind(null, 'Hello  webpack');

    return element;
}

let element = component();
document.body.appendChild(element);
