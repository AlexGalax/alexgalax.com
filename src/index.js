import './scss/base.scss';
import { Terminal } from "./js/terminal";

function onload() {
    const terminal = new Terminal(document.querySelector('.terminal .output'));
    console.log(terminal);
    terminal.boot();
    document.querySelector('.terminal .output');
}

window.addEventListener("load", onload);