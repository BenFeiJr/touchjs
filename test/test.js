// import VConsole from 'vconsole';
import touch from '../src/touch.js';

const button = document.getElementById('button');

touch(button).on('tap', (e) => {
    console.log('tap');
});

// new VConsole();

// const jQuery = function (selector) {
//     return new jQuery.fn.Init(selector);
// };

// jQuery.fn = jQuery.prototype = {
//     version: '0.0.1',
//     constructor: jQuery,
//     element: null,
//     list: [],
//     add: function (item) {
//         this.list.push(item);
//         console.log(this.list);
//     }
// };

// jQuery.fn.Init = function (selector) {
//     this.element = selector;
//     console.log(this.element, jQuery.prototype.element);
//     return this;
// };

// jQuery.fn.Init.prototype = jQuery.fn;

// jQuery({ 'a': 1 }).add(1);
// jQuery({ 'b': 2 }).add(2);

console.log(1);
const aa = document.createElement('div');
aa.innerText = '123';
aa.id = 'aa';
document.body.appendChild(aa);
console.log(document.getElementById('aa'));
const start = Date.now();
while ((Date.now()) - start < 3000) {
    //
}
console.log(2);
