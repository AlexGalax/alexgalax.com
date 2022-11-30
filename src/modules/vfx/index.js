import './style.scss';
import setRandomInterval from "set-random-interval";

/**
 * gets a random integer between -maxValue and +maxValue
 * @param maxValue
 * @returns {number}
 */
function getRandomOffsetValue(maxValue) {
    let neg = Math.random() < 0.5;
    return Math.floor(Math.random() * maxValue * (neg ? -1 : 1));
}

export class ChromaticAberration {

    constructor(el, options = {})
    {
        this.el = el;

        let {
            intervalMin = 100,
            intervalMax = 300,
            maxOffsetX = 3,
            maxOffsetY = 3
        } = options;

        this.intervalMin = intervalMin;
        this.intervalMax = intervalMax;
        this.maxOffsetX = maxOffsetX;
        this.maxOffsetY = maxOffsetY;

        this.el.style.transition = 'text-shadow ' + intervalMin + 'ms ease';

        this.play();
    }

    setProperties(){
        this.el.style.textShadow =
              getRandomOffsetValue(this.maxOffsetX) + "px " + getRandomOffsetValue(this.maxOffsetY) + "px 1px #f004, "
            + getRandomOffsetValue(this.maxOffsetX) + "px " + getRandomOffsetValue(this.maxOffsetY) + "px 1px #0f04, "
            + getRandomOffsetValue(this.maxOffsetX) + "px " + getRandomOffsetValue(this.maxOffsetY) + "px 1px #00f4"
    }

    play(){
        this.active = true;
        this.interval = setRandomInterval(this.setProperties.bind(this), this.intervalMin, this.intervalMax);
    }

    stop(){
        this.active = false;
        this.interval.clear();
        this.el.style.textShadow = '';
    }

    toggle(){
        if(this.active) {
            this.stop();
        }else {
            this.play();
        }
    }
}

export class Shake {

    constructor(el, options = {})
    {
        this.el = el;

        let {
            intervalMin = 100,
            intervalMax = 500,
            maxOffsetX = 1,
            maxOffsetY = 1,
        } = options;

        this.intervalMin = intervalMin;
        this.intervalMax = intervalMax;
        this.maxOffsetX = maxOffsetX;
        this.maxOffsetY = maxOffsetY;

        this.el.style.transition = 'transform ' + intervalMin + 'ms ease';

        this.play();
    }

    setProperties()
    {
        this.el.style.transform = 'translate(' + getRandomOffsetValue(this.maxOffsetX) + 'px, ' + getRandomOffsetValue(this.maxOffsetY) + 'px)';
    }

    play(){
        this.active = true;
        this.interval = setRandomInterval(this.setProperties.bind(this), this.intervalMin, this.intervalMax);
    }

    stop(){
        this.active = false;
        this.interval.clear();
        this.el.style.transform = '';
    }

    toggle(){
        if(this.active) {
            this.stop();
        }else {
            this.play();
        }
    }
}

export class Glitch {
    constructor(el, options = {})
    {
        this.el = el;

        let {
            duration = 1000,
            minDelay = 5000,
            maxDelay = 10000,
            className = 'glitch'
        } = options;

        this.duration = duration;
        this.minDelay = minDelay;
        this.maxDelay = maxDelay;
        this.className = className;

        this.play();
    }

    toggleClass(){
        this.el.classList.add(this.className);
        const _this = this;
        setTimeout(function() {
            _this.el.classList.remove(_this.className);
        }, this.duration);
    }

    play(){
        this.active = true;
        this.interval = setRandomInterval(this.toggleClass.bind(this), this.minDelay, this.maxDelay);
    }

    stop(){
        this.active = false;
        this.interval.clear();
    }

    toggle(){
        if(this.active) {
            this.stop();
        }else {
            this.play();
        }
    }
}

export class Vignette {
    constructor(el, options = {}) {

        this.el = el;

        let {
            size = '300px',
            opacity = '1'
        } = options;

        this.vignetteEl = document.createElement('div');
        this.el.append(this.vignetteEl);
        this.add();

        const r = document.querySelector(':root')
        r.style.setProperty('--vignette-size', size);
        r.style.setProperty('--vignette-opacity', opacity);
    }

    add(){
        this.active = true;
        this.vignetteEl.classList.add('vignette');
    }

    remove(){
        this.active = false;
        this.vignetteEl.classList.remove('vignette');
    }

    toggle(){
        if(this.active) {
            this.remove();
        }else {
            this.add();
        }
    }
}

export class HorizontalScanlines {
    constructor(el, options = {}) {

        this.el = el;

        let {
            size = '4px',
            opacity = '0.1'
        } = options;

        this.scanlineEl = document.createElement('div');
        this.el.append(this.scanlineEl);
        this.add();

        const r = document.querySelector(':root')
        r.style.setProperty('--horizontal-scanlines-size', size);
        r.style.setProperty('--horizontal-scanlines-opacity', opacity);
    }

    add(){
        this.active = true;
        this.scanlineEl.classList.add('scanlines-horizontal');
    }

    remove(){
        this.active = false;
        this.scanlineEl.classList.remove('scanlines-horizontal');
    }

    toggle(){
        if(this.active) {
            this.remove();
        }else {
            this.add();
        }
    }
}

export class VerticalScanlines {
    constructor(el, options = {}) {

        this.el = el;

        let {
            size = '50px',
            opacity = '0.01',
            duration = '30s'
        } = options;

        this.scanlineEl = document.createElement('div');
        this.el.append(this.scanlineEl);
        this.add();

        const r = document.querySelector(':root')
        r.style.setProperty('--vertical-scanlines-size', size);
        r.style.setProperty('--vertical-scanlines-opacity', opacity);
        r.style.setProperty('--vertical-scanlines-duration', duration);
    }

    add(){
        this.active = true;
        this.scanlineEl.classList.add('scanlines-vertical');
    }

    remove(){
        this.active = false;
        this.scanlineEl.classList.remove('scanlines-vertical');
    }

    toggle(){
        if(this.active) {
            this.remove();
        }else {
            this.add();
        }
    }
}