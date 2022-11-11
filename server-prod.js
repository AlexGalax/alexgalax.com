const dotenv = require('dotenv');
const express = require('express');
const https = require('https');
const fs = require('fs');

dotenv.config();

const app = express();

const credentials = {
    key: fs.readFileSync(__dirname + '/sslcert/private.key'),
    cert: fs.readFileSync(__dirname + '/sslcert/server.crt')
};

https
    .createServer(credentials, app)
    .listen(process.env.PORT, ()=>{
        console.log('server is running at port ' + process.env.PORT)
    });

app.get('/', (req,res)=>{
    res.send("Hello from your express server.")
})