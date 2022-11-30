import Cookies from "js-cookie";
import setRandomInterval from 'set-random-interval';
import {BotApi} from "../bot-api";
import {AsciiBot} from "./utils/asciibots";
import {createHeader, createIOElements} from "./utils/html";

import './style.scss';

// @todo catch up/down and add input history (maybe)
// @todo catch left/right and move cursor (maybe)

export class Terminal {
    $inputPrint;
    $inputField;
    $output;
    $input;

    constructor($terminal, options = {}) {

        if(!Cookies.get('lastVisit')){
            this.updateCookie();
        }

        let {
            inputEnabled = false,
            cursor = '█',
            prompt = '> ',
            asciiBotBody = '000'
        } = options;

        this.prompt = prompt;
        this.botApi = new BotApi();

        const r = document.querySelector(':root')
        r.style.setProperty('--terminal-cursor', '\'' + cursor + '\'');
        r.style.setProperty('--terminal-prompt', '\'' + prompt + '\'');

        // create header elements asciibot & logo
        this.$asciiBot = createHeader($terminal);
        this.asciiBot = new AsciiBot(this.$asciiBot, asciiBotBody);
        this.asciiBot.updateAsciiBot('sleeping');

        // creat IO Elements
        [ this.$output, this.$input, this.$inputPrint, this.$inputField ] = createIOElements($terminal);
        // always have the cursor at end of the input field
        this.$inputField.addEventListener('keydown', this.processUserKeyPress.bind(this));
        this.$inputField.addEventListener('keyup', this.processUserKeyPress.bind(this));


        document.addEventListener('click', () => {
            if(this.isInputActive){
                this.$inputField.focus();
            }
        });

        this.inputlength = 0;

        if(inputEnabled)
            this.enableInput();
        else
            this.disableInput();

    }

    updateCookie(){
        Cookies.set('lastVisit', Math.floor(Date.now() / 1000), { expires: 3650 });
    }

    getTimeLastVisit(){
        return Cookies.get('lastVisit') || Math.floor(Date.now() / 1000);
    }

    enableInput(){
        this.isInputActive = true;
        this.$input.classList.add('active');
        this.$inputField.focus();
        return this;
    }

    disableInput(){
        this.isInputActive = false;
        this.$input.classList.remove('active');
        return this;
    }

    clearInput(){
        this.$inputPrint.innerText = '';
        this.$inputField.value = '';
        this.inputlength = 0;
        return this;
    }

    processUserKeyPress(event){
        this.$inputField.setSelectionRange(1000, 1000);
        if(!this.isInputActive){
            event.preventDefault();
        }else{
            if(event.keyCode === 13){
                this.processUserPrompt();
            }else if(this.isInputPrintable()){
                this.inputlength = this.$inputField.value.length;
                this.$inputPrint.innerText = this.$inputField.value;
            }
        }
    }

    async processUserPrompt(){

        this.updateCookie();
        const prompt = this.$inputPrint.innerText;
        this.asciiBot.updateAsciiBot('thinking');
        this.disableInput()
            .print(this.prompt + ' ' + this.$inputPrint.innerText)
            .clearInput()
            .break();

        const answer = await this.botApi.getAnswer(prompt);
        await this.outputAnswer(answer, 'Sorry, I couldn\'t process your input.', 'neutral');
    }

    async greet(){
        const answer = await this.botApi.getGreeting();
        await this.outputAnswer({text: answer}, 'Hello?', 'smile');
    }

    async outputAnswer( answer, defaultText, defaultMood ) {
        this.asciiBot.updateAsciiBot(answer.mood ||defaultMood);
        this.print(this.prompt + ' ');
        await this.type(answer.text || defaultText, { typeSpeedMin: 10, typeSpeedMax: 50, newLine: false });
        this.break().enableInput();
    }

    scrollToEnd(){
        this.$output.scrollTop = this.$output.scrollHeight;
        return this;
    }

    print(text){
        this.$output.innerHTML = this.$output.innerHTML + text;
        return this;
    }

    async boot( offsetTime ){

        // if last visit is less than `offsetTime` seconds ago, don't boot again.
        offsetTime = offsetTime ?? 3600;
        const now = Math.floor(Date.now() / 1000);
        if( (now - this.getTimeLastVisit()) < offsetTime ){
            this.updateCookie();
            this.asciiBot.updateAsciiBot('neutral');
            return Promise.resolve();
        }

        this.updateCookie();
        const today = new Date();
        await this.print('AG83-OS (TM)    Version 4.20 Release 69').break()
                  .print('(C) DeineMutter Corp').break().wait(1000);
        await this.print('Current date is ' + today.toLocaleString()).break().wait(1000);
        await this.print('Checking hardware status').type('.........', { typeSpeedMin: 10, typeSpeedMax: 500, newLine: true });
        await this.print('CPU: X-Blitz (R) Kern 1337').break().wait(200);
        await this.print('Speed: 4.77 MHz').break().wait(200);
        await this.print('Memory Test: 262144 bytes').type('...... ', { typeSpeedMin: 10, typeSpeedMax: 500 });
        await this.print('OK').break().wait(200);
        await this.print('Starting [Bot Lifeform Extension B.L.E.X.(R)]').break().wait(200);
        await this.print('Loading emotion database').type('........ ', { typeSpeedMin: 10, typeSpeedMax: 500 });
        await this.print('OK').break().wait(200);
        await this.print('Building common sense').type('.... ', { typeSpeedMin: 10, typeSpeedMax: 500 });
        await this.print('OK').break().wait(200);
        await this.print('Connecting memories').type('........ ', { typeSpeedMin: 10, typeSpeedMax: 500 });
        await this.print('OK').break().wait(200);
        await this.print('Waking Blex up').type('... ', { typeSpeedMin: 10, typeSpeedMax: 500 });
        await this.print('OK').break().wait(200);
        this.print('Data you submit will be sent to OpenAI, L.L.C. If you are cautious about your personal data, just don\'t enter any. If you want to know how they use personal data, head over to their <a href="https://openai.com/privacy/" target="_blank">Privacy Policy</a>.').break();

        this.asciiBot.updateAsciiBot('neutral');

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
                    this.scrollToEnd();
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

    isInputPrintable() {
        // user input is printable, if length of the input did change. Any character or backspace.
        return (
            this.inputlength > this.$inputField.value.length
            || this.inputlength < this.$inputField.value.length
        )
    }
}