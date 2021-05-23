const express = require("express");
const router = express.Router();

router.post("/like", async (req, res) => {
    const response = await functions.likePost(req); 
    res.status(response.status).send(response);
})

router.post("/unlike", async (req, res) => {
    const response = await functions.unlikePost(req); 
    res.status(response.status).send(response);
})

router.post("/add", async (req, res) => {
    const response = await functions.addPost(req);
    res.status(response.status).send(response);
})

router.post("/delete", async (req, res) => {
    const response = await functions.deletePost(req);
    res.status(response.status).send(response);
})

router.post("/seen", async (req, res) => {
    const response = await functions.seenPost(req);
    res.status(response.status).send(response);
})

router.post("/edit", async (req, res) => {
    const response = await functions.editPost(req);
    res.status(response.status).send(response);
})

module.exports = router;