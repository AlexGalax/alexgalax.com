import './vfx.scss';
import setRandomInterval from "set-random-interval";

function getRandomOffsetValue(maxValue) {
    let neg = Math.random() < 0.5;
    return Math.floor(Math.random() * maxValue * (neg ? -1 : 1));
};

export class ChromaticAberration {

    constructor(el, options = {})
    {
        this.el = el;

        let {
            interval = 200,
            maxOffsetX = 3,
            maxOffsetY = 3
        } = options;

        this.interval = interval;
        this.maxOffsetX = maxOffsetX;
        this.maxOffsetY = maxOffsetY;

        this.el.style.transition = 'text-shadow ' + interval + 'ms ease';

        setInterval(this.setProperties.bind(this), this.interval);
    };

    setProperties(){
        this.el.style.textShadow =
              getRandomOffsetValue(this.maxOffsetX) + "px " + getRandomOffsetValue(this.maxOffsetY) + "px 1px #f004, "
            + getRandomOffsetValue(this.maxOffsetX) + "px " + getRandomOffsetValue(this.maxOffsetY) + "px 1px #0f04, "
            + getRandomOffsetValue(this.maxOffsetX) + "px " + getRandomOffsetValue(this.maxOffsetY) + "px 1px #00f4"
    };
}

export class Shake {

    constructor(el, options = {})
    {
        this.el = el;

        let {
            interval = 200,
            maxOffsetX = 1,
            maxOffsetY = 1,
        } = options;

        this.interval = interval;
        this.maxOffsetX = maxOffsetX;
        this.maxOffsetY = maxOffsetY;

        this.el.style.transition = 'transform ' + interval + 'ms ease';

        setInterval(this.setProperties.bind(this), this.interval);
    };

    setProperties()
    {
        this.el.style.transform = 'translate(' + getRandomOffsetValue(this.maxOffsetX) + 'px, ' + getRandomOffsetValue(this.maxOffsetY) + 'px)';
    };
};

export class Glitch {
    constructor(el, options = {})
    {
        this.el = el;

        let {
            duration = 1000,
            minDelay = 5000,
            maxDelay = 10000
        } = options;

        this.duration = duration;
        this.minDelay = minDelay;
        this.maxDelay = maxDelay;

        setRandomInterval(this.toggleClass.bind(this), this.minDelay, this.maxDelay);
    };

    toggleClass(){
        this.el.classList.add(this.className);
        const _this = this;
        setTimeout(function() {
            _this.el.classList.remove(_this.className);
        }, this.duration);
    }
}

export class HorizontalScanlines {
    constructor(el, options = {}) {

        this.el = el;

        let {
            size = '4px',
            opacity = '0.1'
        } = options;

        const scanlineEl = document.createElement('div');
        scanlineEl.classList.add('scanlines-horizontal');
        this.el.append(scanlineEl);

        const r = document.querySelector(':root')
        r.style.setProperty('--horizontal-scanlines-size', size);
        r.style.setProperty('--horizontal-scanlines-opacity', opacity);
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

        const scanlineEl = document.createElement('div');
        scanlineEl.classList.add('scanlines-vertical');
        this.el.append(scanlineEl);

        const r = document.querySelector(':root')
        r.style.setProperty('--horizontal-scanlines-size', size);
        r.style.setProperty('--horizontal-scanlines-opacity', opacity);
        r.style.setProperty('--horizontal-scanlines-duration', duration);
    }
}