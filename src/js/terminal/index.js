import setRandomInterval from 'set-random-interval';

export class Terminal {

    constructor(inputContainer,outputContainer) {
        // @todo: user input

        this.inputContainer = inputContainer || document.querySelector('.terminal .input');
        this.outputContainer = outputContainer || document.querySelector('.terminal .output');
    }

    scrollToEnd(){
        this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
        return this;
    }

    print(text){
        this.outputContainer.innerHTML = this.outputContainer.innerHTML + text;
        return this;
    }

    async boot(){
        const today = new Date();

        await this.print('AG83-OS(TM)    Version 4.20 Release 69').break()
                  .print('(C) MutterBrett Corp').break().wait(1000);
        await this.print('Current date is ' + today.toLocaleString()).break().wait(1000);
        await this.print('Loading system controls').type('.......................', { typeSpeedMin: 10, typeSpeedMax: 500, newLine: true });
        await this.print('Checking hardware status').type('................', { typeSpeedMin: 10, typeSpeedMax: 500, newLine: true });
        await this.print('CPU: Blitzz (R) Kern 1337').break().wait(200);
        await this.print('Speed: 4.77 MHz').break().wait(200);
        await this.print('Memory Test: 262144 bytes').type('...... ', { typeSpeedMin: 10, typeSpeedMax: 500 });
        await this.print('OK').break().wait(200);
        await this.print('Device #01 5 MiB hard disk').break().wait(200);
        await this.print('Device #02 360 KiB 5.25" floppy *Xspeed*').break().wait(200);
        this.print('> ').break();
    }

    break(){
        this.print('<br>').scrollToEnd();
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
