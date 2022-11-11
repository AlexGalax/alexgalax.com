const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();

app.listen(process.env.PORT, ()=>{
   console.log('server is running at port ' + process.env.PORT)
});

app.get('/', (req,response)=>{
    response.sendFile((__dirname) + '/dist/index.html');
})