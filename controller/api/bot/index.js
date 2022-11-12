'use strict'

const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const path = require("path");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const aiTraining = fs.readFileSync(path.resolve(__dirname, 'ai_bot_description.txt'), 'utf-8');
const router = express.Router();

router.get('/getAnswer', async function(req, res) {

    // @todo: options as env vars
    const response = await openai.createCompletion({
        model: process.env.OPENAI_MODEL,
        prompt: aiTraining + '\n\nHuman: ' + req.query.prompt,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 0.3,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
    });

    let data = {}

    if(response.data.choices.length > 0){
        console.log('first choice:', response.data.choices[0]);

        // @todo: fix response parsing
        const text = response.data.choices[0].text.match(/^\s*Me ?(\((.*?)\))?:\s*(.*)$/i);
        if(text){
            data = {
                text: text[3],
                mood: text[2]
            }
        }
    }

    res.json(data);
});

module.exports = router;