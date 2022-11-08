import setRandomInterval from 'set-random-interval';

export class Terminal {

    constructor(container) {
        this.container = container || document.querySelector('.terminal');
    }

    print(text){
        this.container.innerHTML = this.container.innerHTML + text;
    }

    async boot(){
        console.log('booting');
        await this.type('Starting system', { newLine: true });
        await this.type('Loading AXGX-OS (TM) 4.20 Release 69');
        await this.type(' .......................', { typeSpeedMin: 10, typeSpeedMax: 500, newLine: true });

    }

    break(){
        console.log('break');
        this.print('<br>');
        return this;
    }

    async type( text, options = {} ) {
        if (!text) return this;

        let {
            typeSpeedMin = 30,
            typeSpeedMax = 30,
            processChars = true,
            newLine = false
        } = options;

        console.log('type start', text);

        let interval;
        await new Promise(async (resolve) => {

            if (interval) {
                interval.clear();
                interval = null;
            }

            let chars = text;
            if (processChars) {
                chars = text.split("");
            }

            interval = setRandomInterval(() => {
                if (chars.length) {
                    let char = chars.shift();
                    this.print(char);
                } else {

                    resolve();
                }
            }, typeSpeedMin, typeSpeedMax);

            return this;
        });

        interval.clear();
        if(newLine){
            this.break();
        }
        console.log('resolved', text);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

}
