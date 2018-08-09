import touch from '../src/touch.js';

const button = document.getElementById('button');

touch(button).on('tap', (e) => {
    console.log('tap');
});
