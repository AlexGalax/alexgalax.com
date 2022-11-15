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

        // @todo: set timestamp in cookie. If t < x, skip boot process.
        if(!Cookies.get('lastVisit')){
            this.updateCookie();
        }

        let {
            inputEnabled = false,
            cursor = '█',
            prompt = '> ',
            asciiBotBody = '000'
        } = options;

        this.$terminal = $terminal;
        this.prompt = prompt;
        this.botApi = new BotApi();

        const r = document.querySelector(':root')
        r.style.setProperty('--terminal-cursor', '\'' + cursor + '\'');
        r.style.setProperty('--terminal-prompt', '\'' + prompt + '\'');

        // create header elements asciibot & logo
        this.$asciiBot = createHeader($terminal);
        this.asciiBot = new AsciiBot(this.$asciiBot, asciiBotBody);
        this.asciiBot.updateAsciiBot();

        // creat IO Elements
        [ this.$output, this.$input, this.$inputPrint, this.$inputField ] = createIOElements($terminal);
        // set focus
        this.$inputField.focus();
        // always have the cursor at end of the input field
        this.$inputField.addEventListener('keydown', () => this.$inputField.setSelectionRange(1000, 1000));
        // listen to user input on input field
        this.$inputField.addEventListener('keyup', this.processUserKeyPress.bind(this))

        if(inputEnabled)
            this.enableInput();
        else
            this.disableInput();

        console.log('lastTimeVisit', this.getTimeLastVisit());
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
        return this;
    }

    processUserKeyPress(event){
        if(!this.isInputActive){
            event.preventDefault();
        }else{
            if(event.keyCode === 13){
                this.processUserPrompt();
            }else if(this.isPrintable(event.keyCode)){
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
        this.asciiBot.updateAsciiBot(answer.mood);
        const printAnswer = answer.text || 'Sorry, I was busy right now.';
        await this.type(printAnswer, { typeSpeedMin: 10, typeSpeedMax: 50, newLine: false });
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
            return Promise.resolve();
        }

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

        return Promise.resolve();
    }

    async greet(){
        const answer = await this.botApi.getGreeting();
        this.asciiBot.updateAsciiBot(answer.mood);
        const printAnswer = answer.text || 'Hello?';
        await this.type(printAnswer, { typeSpeedMin: 10, typeSpeedMax: 50, newLine: false });
        this.break();
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

            let firstPrint = true;
            let chars = text;
            if (processChars) {
                chars = text.split("");
            }

            interval = setRandomInterval(() => {
                if (chars.length) {
                    let char = chars.shift();
                    this.print(char);
                    if(firstPrint){
                        this.scrollToEnd();
                        firstPrint = false;
                    }
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