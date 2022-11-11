import setRandomInterval from 'set-random-interval'
import './terminal.scss'

// @todo catch up/down and add input history
// @todo (catch left/right and move cursor?)
// @todo mobile input - how?

const terminalClass = class Terminal {

    constructor($terminal, options = {}) {

        let {
            inputEnabled = false,
            cursor = '█',
            prompt = '> '
        } = options;

        this.$terminal = $terminal;
        this.prompt = prompt;
        this.history = [];
        const logo = '   _____  .__\n' +
            '  /  _  \\ |  |   ____ ___  ___\n' +
            ' /  /_\\  \\|  | _/ __ \\\\  \\/  /\n' +
            '/    |    \\  |_\\  ___/ >    <\n' +
            '\\____|__  /____/\\___  >__/\\_ \\\n' +
            ' /  ____\\/_____  |  |\\/____ \\/__  ___\n' +
            '/   \\  ___\\__  \\ |  | \\__  \\ \\  \\/  /\n' +
            '\\    \\_\\  \\/ __ \\|  |__/ __ \\_>    <\n' +
            ' \\______  (____  /____(____  /__/\\_ \\\n' +
            '        \\/     \\/          \\/      \\/';

        this.openai = new OpenAIApi(new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        }));

        const r = document.querySelector(':root')
        r.style.setProperty('--terminal-cursor', '\'' + cursor + '\'');
        r.style.setProperty('--terminal-prompt', '\'' + prompt + '\'');

        const header = document.createElement('div');
        header.classList.add('header');
            this.$headerBot = document.createElement('pre');
            this.$headerBot.classList.add('asciibot');
        header.append(this.$headerBot);
            const headerLogo = document.createElement('pre');
            headerLogo.classList.add('logo');
            headerLogo.innerText = logo;
        header.append(headerLogo);
        this.$terminal.append(header);

        this.$output = document.createElement('div');
        this.$output.classList.add('output');
        this.$terminal.append(this.$output);

        this.$input = document.createElement('div');
        this.$input.classList.add('input');
        this.$terminal.append(this.$input);
        
        this.inputPrint = document.createElement('span');
        this.$input.append(this.inputPrint);

        window.addEventListener('keyup', this.processUserKeyUp.bind(this));

        if(inputEnabled)
            this.enableInput();
        else
            this.disableInput();
    }

    enableInput(){
        this.isInputActive = true;
        this.$input.classList.add('active');
        return this;
    }

    disableInput(){
        this.isInputActive = false;
        this.$input.classList.remove('active');
        return this;
    }

    clearInput(){
        this.inputPrint.innerText = '';
        return this;
    }

    processUserKeyUp(event){
        if(this.isInputActive){
            if(event.keyCode === 13){
                this.processUserPrompt();
            }else if(this.isPrintable(event.keyCode)){
                this.inputPrint.innerText = this.inputPrint.innerText + event.key;
            }
        }
    }

    async processUserPrompt(){
        const userInput = this.prompt;

        // @todo add history
        this.disableInput()
            .print(this.prompt + ' ' + this.inputPrint.innerText)
            .clearInput()
            .break();

        // const response = await openai.createCompletion({
        //     model: "text-babbage-001",
        //     prompt: process.env.OPENAI_BLEX + '\n\n Human: ' + userInput,
        //     temperature: 1,
        //     max_tokens: 100,
        //     top_p: 0.5,
        //     frequency_penalty: 0.5,
        //     presence_penalty: 0.0,
        // });
        // console.log(response);

        this.type('haha').then( () => {
            this.break().enableInput();
        })
    }

    scrollToEnd(){
        this.$output.scrollTop = this.$output.scrollHeight;
        return this;
    }

    print(text){
        this.$output.innerHTML = this.$output.innerHTML + text;
        return this;
    }

    async boot(){
        const today = new Date();

        await this.print('AG83-OS (TM)    Version 4.20 Release 69').break()
                  .print('(C) DeineMutter Corp').break().wait(1000);
        await this.print('Current date is ' + today.toLocaleString()).break().wait(1000);
        await this.print('Loading system controls').type('.......................', { typeSpeedMin: 10, typeSpeedMax: 500, newLine: true });
        await this.print('Checking hardware status').type('................', { typeSpeedMin: 10, typeSpeedMax: 500, newLine: true });
        await this.print('CPU: X-Blitz (R) Kern 1337').break().wait(200);
        await this.print('Speed: 4.77 MHz').break().wait(200);
        await this.print('Memory Test: 262144 bytes').type('...... ', { typeSpeedMin: 10, typeSpeedMax: 500 });
        await this.print('OK').break().wait(200);
        await this.print('Device #01 5 MiB hard disk').break().wait(200);
        await this.print('Device #02 360 KiB 5.25" floppy *Xspeed*').break().wait(200);
    }

    break(){
        this.print('<br>')
            .scrollToEnd();
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
    }

    isPrintable(keycode) {
        return (
            (keycode > 47 && keycode < 58) || // number keys
            keycode === 32 || // spacebar & return key(s) (if you want to allow carriage returns)
            (keycode > 64 && keycode < 91) || // letter keys
            (keycode > 95 && keycode < 112) || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode > 218 && keycode < 223)
        );
    }
}

const Terminal = new Proxy(terminalClass, {
    set: function (target, key, value) {
        console.log(`${key} set to ${value}`);
        target[key] = value;
        return true;
    }
})

export default Terminal