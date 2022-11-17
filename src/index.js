import './scss/base.scss';
import { Terminal } from "./modules/terminal";
import Starfield from "./modules/starfield";
import { Shake, ChromaticAberration, Glitch, HorizontalScanlines, VerticalScanlines, Vignette } from './modules/vfx';

function onload() {

    const $s = document.querySelector('.screen');
    const $t = document.querySelector('.terminal');

    // add effects to screen
    const starfield = new Starfield($s);
    const vfxScanlinesH = new HorizontalScanlines($s);
    const vfxScanlinesV = new VerticalScanlines($s);
    const vfxVignette = new Vignette($s, {size: '300px', opacity: 1});

    // add effects to terminal text
    const vfxCA = new ChromaticAberration($t);
    const vfxShake = new Shake($t);
    const vfxGlitch = new Glitch($t);

    const vfxButton = document.createElement('button');
    vfxButton.innerText = 'Toggle Effects';
    vfxButton.classList.add('toggleVfx');
    vfxButton.addEventListener('click', () => {
        starfield.toggle();
        vfxScanlinesH.toggle();
        vfxScanlinesV.toggle();
        vfxVignette.toggle();
        vfxCA.toggle();
        vfxShake.toggle();
        vfxGlitch.toggle();
    });
    document.body.append(vfxButton);

    // start terminal
    const terminal = new Terminal($t, {inputEnabled: false, cursor: '█'});

    terminal.boot(3600).then(async () => {
        await terminal.greet();
        terminal.enableInput();
    });
}

window.addEventListener("load", onload);