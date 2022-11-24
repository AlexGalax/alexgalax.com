const mongoose = require('mongoose');
const {errorLog} = require('./log');

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

async function dbConnect(){
    return await mongoose.connect(process.env.MONGO_DB_CONNECTION)
    .catch(() => {
        errorLog.error("can't connect to database " + process.env.MONGO_DB_CONNECTION);
        return  Promise.resolve(false);
    });
}

async function dbGetRecordById(model, id){
    return await model.findById(id).exec()
        .catch((err) => {
            errorLog.error("can't get record from database. Error: %j" + err);
            return  Promise.resolve(false);
        }
    );
}

async function dbSaveRecord(record){
    return await record.save()
        .catch((err) => {
            errorLog.error("can't save record to database. Error: %j " + err);
            return  Promise.resolve(false);
        }
    );
}

/**
 * get last conversation of user
 * @param userId
 * @returns {Promise<array>}
 */
exports.dbGetLastConversation = async function(userId) {
    const c = await dbConnect();
    if(c === false){
        return Promise.resolve([]);
    }

    let user = await dbGetRecordById(User, userId);
    return user ? Promise.resolve(user.conversations.slice(-1)[0]) : Promise.resolve([]);
}

exports.dbUpdateLastConversationSummary = async function(userId, summary) {
    const c = await dbConnect();
    if(c === false){
        return Promise.resolve([]);
    }

    let user = await dbGetRecordById(User, userId);
    if(!user){
        return Promise.resolve([]);
    }else{
        const index = user.conversations.length - 1;
        user.conversations[index].summary = summary;
        return await dbSaveRecord(user);
    }
}

exports.dbAddDialog = async function(userId, prompt, completion, state, choice) {
    const c = await dbConnect();
    if(c === false){
        return Promise.resolve([]);
    }

    const data = { prompt: prompt, completion: completion, state: state, choice: choice };
    let user = await dbGetRecordById(User, userId);

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

    return await dbSaveRecord(user);
}

