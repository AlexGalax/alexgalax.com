'use strict'

const express = require("express");
const {dbGetLastConversation, dbAddDialog, dbUpdateLastConversationSummary} = require("../../../utils/mongodb");
const {openaiGetDialogAnswer, aiFormatLastConversation, openaiGetConversationSummary, openaiGetUserGreeting} = require("../../../utils/openai");

const router = express.Router();

// @todo: catch potential errors, that might cause express to crash

router.get('/getAnswer', async function(req, res) {

    const data = await openaiGetDialogAnswer(req.query.userId, req.query.prompt);

    dbAddDialog(
        req.query.userId,
        req.query.prompt,
        JSON.stringify(data),
        data.text !== undefined ? 1 : 0,
        JSON.stringify(data.text)
    ).catch(
        //@todo: error log: https://www.npmjs.com/package/errorlog
        err => console.error(err)
    );

    res.json(data);
});

router.get('/getGreeting', async function(req, res) {

    const userId = req.query.userId;

    let conversationSummary = '';
    let lastConversation = await dbGetLastConversation(userId);
    if(lastConversation && lastConversation.summary){
        conversationSummary = lastConversation.summary;
    }else if(lastConversation) {
        const formattedConversation = aiFormatLastConversation(lastConversation);
        if(formattedConversation){
            conversationSummary = await openaiGetConversationSummary(formattedConversation, userId);
            dbUpdateLastConversationSummary(userId, conversationSummary).catch(err => console.error(err));
        }
    }

    const data = await openaiGetUserGreeting(conversationSummary, userId);

    res.json(data);
});

module.exports = router;