const dotenv = require('dotenv');
const express = require('express');
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:' + process.env.PORT_DEV
}));

app.use('/api/bot', require('./controller/api/bot'));

app.listen(process.env.PORT_PROD, ()=>{
    console.log('Production server is running at port ' + process.env.PORT_PROD)
});

exports.app = app;