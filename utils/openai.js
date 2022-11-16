const {Configuration, OpenAIApi} = require("openai");
const path = require("path");
const fs = require("fs");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openaiConfig = {
    botDescriptionFile: path.resolve(__dirname, 'ai_bot_description.txt'),
    answerPromptPrefix: '\n\nHuman: ',
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
    // console.log('####################################################################');
    // console.log('####################################################################');
    // console.log('<choice>', firstChoice);
    let data = {};
    let text = firstChoice;
    text = text.split('\n').filter(n => n);
    text = text[0].trim();
    // console.log('<trimmed>', text);
    text = text.match(/^(?:.*? ?(?:\((.*?)\))?:)?\s*?(.*?)$/i);
    // console.log('<parsed>', text);
    if(text[2]){
        data = {
            text: text[2].trim(),
            mood: text[1]
        }
    }
    console.log('<data>', data);
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
            user: userId
        }
    });

    let data = {};
    if(response.data.choices.length > 0){
        console.log('<choices>', response.data.choices[0]);
        data = response.data.choices[0].text.trim();
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
            // we want a straight forward completion
            temperature: .8,
            // not so long pls
            max_tokens: 200,
        }
    });

    let data = {};
    if(response.data.choices.length > 0){
        console.log('<choices>', response.data.choices[0]);
        data = response.data.choices[0].text.trim();
    }

    return Promise.resolve(data);
}

exports.openaiGetDialogAnswer = async function(userId, prompt) {

    const response = await openai.createCompletion({
        ...openaiRequestConfig,
        ...{
            prompt: aiTraining + openaiConfig.answerPromptPrefix + prompt + openaiConfig.answerPromptSuffix,
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
    }

    return Promise.resolve(data);
}