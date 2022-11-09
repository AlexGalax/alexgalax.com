import './scss/base.scss';
import { Terminal } from "./js/terminal";
import { Asciibots } from "./js/asciibots";
import {Shake, ChromaticAberration, Glitch} from './js/vfx';
import Starfield from "./js/starfield";

function onload() {

    const $t = document.querySelector('.terminal');
    const $i = $t.querySelector('.input');
    const $o = $t.querySelector('.output');

    new Starfield(document.querySelector('canvas.starfield'));
    new ChromaticAberration($t);
    new Shake($t);
    new Glitch($t);

    // init terminal
    const terminal = new Terminal($o);

    // add asciibot to terminal header
    document.querySelector('.header .asciibot').innerHTML = Asciibots.bot()+'\n\n';

    // boot terminal
    terminal.boot();
}

window.addEventListener("load", onload);