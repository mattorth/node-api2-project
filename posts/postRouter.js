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

// Create a comment
router.post('/:id/comments', (req, res) => {
    const {post_id} = req.params;
    const comment = req.body;

    if(!comment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }

    db.findById(post_id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                db.insertComment(comment)
                    .then(id => {
                        res.status(201).json(comment);
                    })
                    .catch(err => {
                        res.status(500).json({ error: "There was an error while saving the comment to the database." })
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

// GET posts
router.get('/', (req, res) => {
    db.find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });
});

// GET a specific post
router.get('/:id', (req, res) => {
    const {post_id} = req.params;

    db.findById(post_id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post could not be retrieved." });
        });
});

// GET comments
router.get('/:id/comments', (req, res) => {
    const {post_id} = req.params;

    db.findById(post_id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                db.findPostComments(post_id)
                    .then(comments => {
                        res.status(200).json(comments);
                    })
                    .catch(err => {
                        res.status(500).json({ error: "The comments information could not be retrieved." });
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

// Delete a post
router.delete('/:id', (req, res) => {
    const {post_id} = req.params;

    db.findById(post_id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                db.remove(post_id)
                    .then(del => {
                        res.status(200).json(post);
                    })
                    .catch(err => {
                        res.status(500).json({ error: "The post could not be removed." });
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });

});

// PUT (update) a post
router.put('/:id', (req, res) => {
    const {post_id} = req.params;
    const changes = req.body;

    if(!changes.title || !changes.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }

    db.findById(post_id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                db.update(post_id, changes)
                    .then(count => {
                        if(count === 1) {
                            res.status(200).json(post);
                        } else {
                            res.status(500).json({ error: "The post information could not be modified." });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({ error: "The post information could not be modified." });
                    });
            }
        })
        .catch(err => {
            console.log(err);
        });
})









// export router
module.exports = router;