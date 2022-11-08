import setRandomInterval from 'set-random-interval';

export class Terminal {

    constructor(container) {
        this.container = container || document.querySelector('.terminal');
    }

    print(text){
        this.container.innerHTML = this.container.innerHTML + text;
        return this;
    }

    async boot(){
        const today = new Date();
        console.log('booting');
        this.print('AG83-OS(TM)    Version 4.20 Release 69')
            .break()
            .print('(C) AxGx Corp')
            .break();
        await this.wait(1000);
        this.print('Current date is ' + today.toString()).break();
        await this.wait(1000);
        this.print('Loading system controls');
        await this.type('.......................', { typeSpeedMin: 10, typeSpeedMax: 500, newLine: true });
        this.print('Checking hardware status');
        await this.type('................', { typeSpeedMin: 10, typeSpeedMax: 500, newLine: true });
        this.print('Memory Test: 65536 bytes');
        await this.type('...... ', { typeSpeedMin: 10, typeSpeedMax: 500 });
        this.print('OK').break();
        await this.wait(1000);
        this.print('Device #01 5 MiB HDD').break();
        await this.wait(200);
        this.print('Device #02 360K 5.25" floppy *speed*').break();
        await this.wait(1000);
        this.print('> ').break();
    }

    break(){
        console.log('break');
        this.print('<br>');
        return this;
    }

    wait(timeout){
        return new Promise(async (resolve) => {
            setTimeout(function () {
                resolve();
            }, timeout);
        });
    }

    async type( text, options = {} ) {
        if (!text) return this;

        let {
            typeSpeedMin = 30,
            typeSpeedMax = 30,
            processChars = true,
            newLine = false
        } = options;

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
