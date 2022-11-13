import setRandomInterval from 'set-random-interval';
import {BotApi} from "../bot-api";
import './terminal.scss';

// @todo catch up/down and add input history
// @todo (catch left/right and move cursor?)
// @todo mobile input - how?

export class Terminal {

    constructor($terminal, options = {}) {

        let {
            inputEnabled = false,
            cursor = '█',
            prompt = '> '
        } = options;

        this.$terminal = $terminal;
        this.prompt = prompt;
        this.botApi = new BotApi();

        // @todo up/down arrow command history (low prio)
        this.history = [];

        const r = document.querySelector(':root')
        r.style.setProperty('--terminal-cursor', '\'' + cursor + '\'');
        r.style.setProperty('--terminal-prompt', '\'' + prompt + '\'');

        // create header elements asciibot & logo
        const header = document.createElement('div');
        header.classList.add('header');
            this.$headerBot = document.createElement('pre');
            this.$headerBot.classList.add('asciibot');
        header.append(this.$headerBot);
            const headerLogo = document.createElement('pre');
            headerLogo.classList.add('logo');
            headerLogo.innerText = app.config.logo;
        header.append(headerLogo);
        this.$terminal.append(header);

        // create output container
        this.$output = document.createElement('div');
        this.$output.classList.add('output');
        this.$terminal.append(this.$output);

        // create input wrapper
        this.$input = document.createElement('div');
        this.$input.classList.add('input');
        this.$terminal.append(this.$input);

        // create input visual element
        this.inputPrint = document.createElement('span');
        this.$input.append(this.inputPrint);

        // An invisible input field is needed, to have the keyboard opened
        // on mobile devices. To keep the keyboard opened, focus is set
        // everytime it loses focus (blur).
        this.inputField = document.createElement('input');
        this.inputField.addEventListener('blur', (e) => {
            const elm = e.target;
            setTimeout(() => elm.focus());
        })
        // always have the cursor at end of the input field
        this.inputField.addEventListener('keydown', () => this.inputField.setSelectionRange(1000, 1000));
        // listen to user input on input field
        this.inputField.addEventListener('keyup', this.processUserKeyPress.bind(this))
        // append to terminal
        this.$input.append(this.inputField);
        // set focus
        this.inputField.focus();

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
        this.inputField.value = '';
        return this;
    }

    processUserKeyPress(event){

        if(!this.isInputActive){
            event.preventDefault();
        }else{
            if(event.keyCode === 13){
                this.processUserPrompt();
            }else if(this.isPrintable(event.keyCode)){
                this.inputPrint.innerText = this.inputField.value;
            }
        }
    }

    async processUserPrompt(){

        const prompt = this.inputPrint.innerText;

        this.disableInput()
            .print(this.prompt + ' ' + this.inputPrint.innerText)
            .clearInput()
            .break();

        const answer = await this.botApi.getAnswer(prompt);
        console.log(answer);
        const printAnswer = answer.text || 'Sorry, I was busy right now.';

        // @todo await + asciibot moods
        this.type(printAnswer).then( () => {
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
            keycode === 32 || // space & return key(s) (if you want to allow carriage returns)
            (keycode > 64 && keycode < 91) || // letter keys
            (keycode > 95 && keycode < 112) || // numpad keys
            (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
            (keycode === 8 || keycode === 46) || // backspace & del
            (keycode === 0 || keycode === 229) || // android always 229 (or 0) lol
            (keycode > 218 && keycode < 223)
        );
    }
}