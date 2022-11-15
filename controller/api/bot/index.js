'use strict'

const fs = require("fs");
const path = require("path");
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openaiConfig = {
    botDescriptionFile: path.resolve(__dirname, 'ai_bot_description.txt'),
    answerPromptPrefix: '\n\nHuman: ',
    answerPromptSuffix: '\n',
    greetingPromptPrefix: '\n\nQuiet short greeting:',
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
const router = express.Router();

const parseAnswer = function(firstChoice){
    console.log('####################################################################');
    console.log('####################################################################');
    console.log('<choice>', firstChoice);
    let data = {};
    let text = firstChoice;
    text = text.split('\n').filter(n => n);
    text = text[0].trim();
    console.log('<trimmed>', text);
    text = text.match(/^(?:.*? ?(?:\((.*?)\))?:)?\s*?(.*?)$/i);
    console.log('<parsed>', text);
    if(text[2]){
        data = {
            text: text[2].trim(),
            mood: text[1]
        }
    }
    console.log('<data>', data);
    return data;
}

router.get('/getAnswer', async function(req, res) {

    const response = await openai.createCompletion({
        ...openaiRequestConfig,
        ...{
            prompt: aiTraining + openaiConfig.answerPromptPrefix + req.query.prompt + openaiConfig.answerPromptSuffix,
            // A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
            user: req.query.userId,
            // we want a straight forward completion
            temperature: .05,
            // not so long pls
            max_tokens: 50,
        }
    });

    let data = {};
    if(response.data.choices.length > 0){
        data = parseAnswer(response.data.choices[0].text);
        // @todo: save conversation in file/db
        // @todo: check if user chatted before (t = 12 hours?). If yes, create a summary, replace for chat and append to training data
    }
    console.log('data', data);
    res.json(data);
});

router.get('/getGreeting', async function(req, res) {

    const response = await openai.createCompletion({
        ...openaiRequestConfig,
        ...{
            prompt: aiTraining + openaiConfig.greetingPromptPrefix,
            // A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
            user: req.query.userId
        }
    });

    let data = {};
    if(response.data.choices.length > 0){
        console.log('choices: ', response.data.choices);
        data = parseAnswer(response.data.choices[0].text);

        // @todo: save conversation in file/db
        // @todo: check if user chatted before (t = 12 hours?). If yes, create a summary, replace for chat and append to training data
    }

    res.json(data);
});

module.exports = router;