import Cookies from 'js-cookie';
import { nanoid } from 'nanoid'

export class BotApi {

    constructor() {
        this.createCookie();
    }

    createCookie(){
        const cookieName = 'userId';
        this.userId = nanoid(12);

        if(!Cookies.get(cookieName)){
            Cookies.set(cookieName, this.userId, { expires: 3650 });
        }else{
            this.userId = Cookies.get(cookieName);
        }
    }

    async getAnswer(prompt) {
        if(!prompt){
            return Promise.resolve();
        }
        return await this.request('getAnswer', { userId: this.userId, prompt: prompt });
    }

    async getGreeting() {
        return await this.request('getGreeting', { userId: this.userId });
    }

    async request(endpoint, data) {

        const url = new URL('/api/bot/' + endpoint, process.env.APP_URL);
        url.search = new URLSearchParams(data).toString();

        return await fetch(url)
            .then(response => response.json())
            .then((data) => { return data; });
    }

}