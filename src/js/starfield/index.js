export default class Starfield {

    constructor($screen) {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('starfield');
        $screen.prepend(this.canvas);

        this.canvasContext = this.canvas.getContext("2d");
        this.stars = this.makeStars(1000);
        this.prevTime = 0;

        this.setCanvasExtents();

        window.onresize = () => {
            this.setCanvasExtents();
        };

        requestAnimationFrame(this.init.bind(this));
    }

    setCanvasExtents() {
        this.w = document.body.clientWidth;
        this.h = document.body.clientHeight;

        this.canvas.width = this.w;
        this.canvas.height = this.h;
    }

    init( time ) {
        this.prevTime = time;
        requestAnimationFrame(this.tick.bind(this));
    }

    tick( time ) {
        let elapsed = time - this.prevTime;
        this.prevTime = time;

        this.moveStars(elapsed * 0.1);

        this.clear();

        const cx = this.w / 2;
        const cy = this.h / 2;

        const count = this.stars.length;
        for (var i = 0; i < count; i++) {
            const star = this.stars[i];

            const x = cx + star.x / (star.z * 0.001);
            const y = cy + star.y / (star.z * 0.001);

            if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
                continue;
            }

            const d = star.z / 1000.0;
            const b = 1 - d * d;

            this.putPixel(x, y, b);
        }

        requestAnimationFrame(this.tick.bind(this));
    }

    makeStars(count) {
        const out = [];
        for (let i = 0; i < count; i++) {
            const s = {
                x: Math.random() * 1600 - 800,
                y: Math.random() * 900 - 450,
                z: Math.random() * 1000
            };
            out.push(s);
        }
        return out;
    }

    clear() {
        this.canvasContext.fillStyle = "#464";
        this.canvasContext.fillRect(0, 0, this.w, this.h);
    }

    putPixel(x, y, brightness) {
        const intensity = brightness * 255;
        const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
        const size = brightness > .75 ? (brightness > .95 ? 3 : 2) : 1;
        this.canvasContext.fillStyle = rgb;
        this.canvasContext.fillRect(x, y, size, size);
    }

    moveStars( distance ) {
        const count = this.stars.length;
        for (var i = 0; i < count; i++) {
            const s = this.stars[i];
            s.z -= distance;
            while (s.z <= 1) {
                s.z += 1000;
            }
        }
    }
}