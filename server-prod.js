const path = require('path');
const express = require('express');
const { app } = require('./server');

// serve /dist
app.use(express.static(path.join(__dirname, 'dist')));

// catch route /
app.get('/', (req,res)=>{
   res.sendFile(__dirname + '/dist/index.html');
});