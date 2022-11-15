const dotenv = require('dotenv');
const express = require('express');
const cors = require("cors");

dotenv.config();

const app = express();

// add cors to header to allow api calls from dev to prod port
if(process.env.APP_ENV === 'dev' || process.env.APP_ENV === 'development'){
    app.use(cors({
        origin: 'http://localhost:' + process.env.PORT_DEV
    }));
}

// catch api routes
app.use('/api/bot', require('./controller/api/bot'));

// listen
app.listen(process.env.PORT_PROD, ()=>{
    console.log('Production server is running on port ' + process.env.PORT_PROD)
});

exports.app = app;