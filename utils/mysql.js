// @todo: replace with mongoDB
const mysql = require('mysql');

exports.mysqlAddConversation = function(userId, prompt, completion, state, completionOrigin) {

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    connection.connect(function(err) {
        if (err) throw err;

        const query = "INSERT INTO conversations (user_id, prompt, completion, state, completionOrigin) VALUES ?";
        const values = [userId, prompt, completion, state, completionOrigin];

        connection.query(query, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });

    });
}