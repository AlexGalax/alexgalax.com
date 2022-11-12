import uniqid from 'uniqid';

export class BotApi {

    constructor() {
        // @todo: save uniqid in cookie
        this.userId = uniqid();
    }

    async getAnswer(prompt) {
        if(!prompt){
            return false;
        }

        const url = new URL('/api/bot/getAnswer', process.env.APP_URL);
        url.search = new URLSearchParams({ userId: this.userId, prompt: prompt }).toString();

        return await fetch(url)
            .then(response => response.json())
            .then((data) => { return data; });

    }

}