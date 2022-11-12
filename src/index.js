import './scss/base.scss';
import { Terminal } from "./js/terminal";
import { Asciibots } from "./js/asciibots";
import { Shake, ChromaticAberration, Glitch, HorizontalScanlines, VerticalScanlines, Vignette } from './js/vfx';
import Starfield from "./js/starfield";

function onload() {

    const $s = document.querySelector('.screen');
    const $t = document.querySelector('.terminal');

    // add effects to screen
    new Starfield($s);
    new HorizontalScanlines($s);
    new VerticalScanlines($s);
    new Vignette($s, {size: '300px', opacity: 1});

    // add effects to terminal text
    new ChromaticAberration($t);
    new Shake($t);
    new Glitch($t);

    // init terminal
    const terminal = new Terminal($t, {inputEnabled: false, cursor: '█'});

    // and boot
    terminal.boot().then(() => {
        console.log('enable input');
        terminal.enableInput();
    });

    // add asciibot to terminal header
    document.querySelector('.header .asciibot').innerHTML = Asciibots.bot()+'\n\n';
}

window.addEventListener("load", onload);