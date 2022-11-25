const {Configuration, OpenAIApi} = require("openai");
const {debugLog, errorLog} = require('./log');
const path = require("path");
const fs = require("fs");
const {dbGetLastConversation} = require("./mongodb");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openaiConfig = {
    botDescriptionFile: path.resolve(__dirname, '../var/text/ai_bot_description.txt'),
    answerPromptPrefix: '\n\nHuman: ',
    answerBotPrefix: '\nMe ',
    answerPromptSuffix: '\n',
    greetingPromptPrefix: '\n\nShort greeting:',
    summaryPromptPrefix: 'Summary:',
}

const openaiRequestConfig = {
    model: process.env.OPENAI_MODEL,
    // Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.
    temperature: .9,
    // Completions size. 1 token ~= 3/4 word
    max_tokens: 100,
    // How many completions to generate for each prompt.
    n: 1,
    // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
    frequency_penalty: 0.5,
    // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    presence_penalty: 0.1
}

const openai = new OpenAIApi(configuration);
const aiTraining = fs.readFileSync(openaiConfig.botDescriptionFile, 'utf-8');

const parseAnswer = function(firstChoice){
    let data = {};
    let text = firstChoice;
    text = text.split('\n').filter(n => n);
    text = text[0].trim();
    text = text.match(/^(?:.*? ?(?:\((.*?)\))?:)?\s*?(.*?)$/i);
    if(text[2]){
        data = {
            text: text[2].trim(),
            mood: text[1]
        }
    }

    return data;
}

exports.aiFormatLastConversation = function(lastConversation){

    if(lastConversation && lastConversation.dialogs) {
        const formattedConversation = lastConversation.dialogs.map(function (dialog) {
            const completion = JSON.parse(dialog.completion);
            if(!completion.text){
                return '';
            }
            let row = 'Human: ' + dialog.prompt + '\nMe';
            if (completion.mood) {
                row = row + ' (' + completion.mood + ')';
            }
            row = row + ': ' + completion.text + '\n\n';
            return row;
        });
        return formattedConversation.join('');
    }

    return false;
}

exports.openaiGetUserGreeting = async function(summary, userId) {

    summary = summary || '';

    const response = await openai.createCompletion({
        ...openaiRequestConfig,
        ...{
            prompt: aiTraining + summary + '\n\n' + openaiConfig.greetingPromptPrefix,
            // A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
            user: userId,
            // we want a completion somewhere between creative and clear
            temperature: .7,
            max_tokens: 50,
        }
    });

    let data = {};
    if(response.data.choices.length > 0){
        data = response.data.choices[0].text.trim();
        debugLog.debug('Greeting for user %s | %s', userId, data);
    }

    return Promise.resolve(data);
}

exports.openaiGetConversationSummary = async function(conversation, userId) {

    const response = await openai.createCompletion({
        ...openaiRequestConfig,
        ...{
            prompt: conversation + openaiConfig.summaryPromptPrefix,
            // A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
            user: userId,
            // we want a completion somewhere between creative and clear
            temperature: .6,
            max_tokens: 200,
        }
    });

    let data = {};
    if(response.data.choices.length > 0){
        data = response.data.choices[0].text.trim();
        debugLog.debug('Conversation summary for user %s | %s', userId, data);
    }

    return Promise.resolve(data);
}

exports.openaiGetDialogAnswer = async function(userId, userPrompt) {

    const lastConversation = await dbGetLastConversation(userId);
    let dialog = '';
    if(lastConversation.dialogs !== undefined && lastConversation.dialogs.length > 0 && !lastConversation.summary){
        dialog = lastConversation.dialogs.map((x) => {
            let dialog = openaiConfig.answerPromptPrefix + x.prompt + openaiConfig.answerBotPrefix;
            const completion = JSON.parse(x.completion);
            if(completion.mood){
                dialog = dialog + '(' + completion.mood + ')';
            }
            return dialog + ': ' + completion.text;
        }).join('\n');
    }

    const prompt = aiTraining + dialog + openaiConfig.answerPromptPrefix + userPrompt + openaiConfig.answerPromptSuffix;

    const response = await openai.createCompletion({
        ...openaiRequestConfig,
        ...{
            prompt: prompt,
            // A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
            user: userId,
            // we want a straight forward completion
            temperature: .05,
            // not so long pls
            max_tokens: 50,
        }
    });

    let data = {};
    if(response.data.choices.length > 0){
        data = parseAnswer(response.data.choices[0].text);
        debugLog.debug('User %s prompt: %s | Answer: %s | Mood: %s', userId, userPrompt, data.text, data.mood);
    }

    return Promise.resolve(data);
}