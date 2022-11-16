const mongoose = require('mongoose');

const dialogSchema = new mongoose.Schema({
    prompt: String,
    completion: String,
    state: Boolean,
    choice: Object
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
    dialogs: [ dialogSchema ],
    summary: String
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    conversations: [ conversationSchema ]
});
const User = mongoose.model('User', userSchema);

/**
 * let last conversation of user
 * @param userId
 * @returns {Promise<array>}
 */
exports.dbGetLastConversation = async function(userId) {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION);

    let user = await User.findById(userId).exec();
    if(!user){
        return Promise.resolve([]);
    }else{
        return Promise.resolve(user.conversations.slice(-1)[0]);
    }
}

exports.dbUpdateLastConversationSummary = async function(userId, summary) {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION);

    let user = await User.findById(userId).exec();
    if(!user){
        return Promise.resolve([]);
    }else{
        const index = user.conversations.length - 1;
        user.conversations[index].summary = summary;
        return await user.save();
    }
}

exports.dbAddDialog = async function(userId, prompt, completion, state, choice) {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION);

    const data = { prompt: prompt, completion: completion, state: state, choice: choice };
    let user = await User.findById(userId).exec();

    if(!user){
        // if user id doesn't exist, creat new record
        user = new User({
            _id: userId,
            conversations: [{
                dialogs: [ data ]
            }],
            summary: []
        });
    }else{
        const index = user.conversations.length - 1;
        // if last conversation is already summarized
        if( user.conversations[index].summary && user.conversations[index].summary.length > 0 ){
            // create new conversation
            user.conversations.push({ dialogs: [ data ] });
        }else{
            // or add dialog to the latest conversation
            user.conversations[index].dialogs.push(data);
        }
    }

    return await user.save();
}

