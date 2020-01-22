// import express
const express = require('express');

// import database
const db = require('../data/db');

// express router
const router = express.Router();

// Create a post
router.post('/', (req, res) => {
    const post = req.body;

    if(!post.title || !post.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }

    db.insert(post)
        .then(id => {
            db.findById(id)
                .then(post => {
                    res.status(201).json(post);
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            res.status(500).json({ error: " There was an error while saving the post to the database." })
        });
});










// export router
module.exports = router;