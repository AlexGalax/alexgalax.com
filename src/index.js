import './scss/base.scss';
import Terminal from "./js/terminal";
import { Asciibots } from "./js/asciibots";
import {Shake, ChromaticAberration, Glitch, HorizontalScanlines} from './js/vfx';
import Starfield from "./js/starfield";

function onload() {

    const $s = document.querySelector('.screen');
    const $t = document.querySelector('.terminal');
    const $i = $t.querySelector('.input');
    const $o = $t.querySelector('.output');

    new HorizontalScanlines($s);

    new Starfield(document.querySelector('canvas.starfield'));
    new ChromaticAberration($t);
    new Shake($t);
    new Glitch($t);

    // init terminal
    const terminal = new Terminal($t, {inputEnabled: false, cursor: '█'});

    // and boot
    terminal.boot().then(() => {
        terminal.enableInput();
    });


    // add asciibot to terminal header
    document.querySelector('.header .asciibot').innerHTML = Asciibots.bot()+'\n\n';
}

window.addEventListener("load", onload);