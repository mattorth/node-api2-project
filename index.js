// import express
const express = require('express');

// import routers
const postRouter = require('./posts/postRouter');

// create server
const server = express();

// global middleware
server.use(express.json());

// bind routers
server.use('/api/posts', postRouter);

// GET request for root path
server.get('/', (req,res) => {
    res.send('Welcome to api project 2!');
});

// listen on port 4000
server.listen(4000, () => {
    console.log("listening on port 4000");
})