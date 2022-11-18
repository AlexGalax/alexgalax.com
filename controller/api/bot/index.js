'use strict'

const express = require("express");
const log = require('../../../utils/log');
const {dbGetLastConversation, dbAddDialog, dbUpdateLastConversationSummary} = require("../../../utils/mongodb");
const {openaiGetDialogAnswer, aiFormatLastConversation, openaiGetConversationSummary, openaiGetUserGreeting} = require("../../../utils/openai");

const router = express.Router();

router.get('/getAnswer', async function(req, res) {

    const data = await openaiGetDialogAnswer(req.query.userId, req.query.prompt);

    dbAddDialog(
        req.query.userId,
        req.query.prompt,
        JSON.stringify(data),
        data.text !== undefined ? 1 : 0,
        JSON.stringify(data.text)
    ).catch(err => log.error(err));

    res.json(data);
});

router.get('/getGreeting', async function(req, res) {

    const userId = req.query.userId;

    let conversationSummary = '';
    let lastConversation = await dbGetLastConversation(userId).catch(err => log.error(err));
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