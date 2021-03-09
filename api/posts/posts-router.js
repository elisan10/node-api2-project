// implement your posts router here
const express = require("express");

const router = express.Router();

const Post = require("./posts-model");

// ENDPOINTS ------------------------>>>>>>

// [GET] /api/posts

router.get("/", (req, res) => {
  Post.find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

// [GET] /api/posts/:id

router.get("/:id", (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.json(post);
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

// [GET] /api/posts/:id/comments

router.get("/:id/comments", (req, res) => {
  Post.findPostComments(req.params.id)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200).json(comments);
      } else {
        res
          .status(404)
          .json({ message: "The post with the sepcified ID does not exist" });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

// [POST] /api/posts

router.post("/", (req, res) => {
  const newPost = req.body;
  if (!newPost.title || !newPost.contents) {
    res
      .status(400)
      .json({ message: "Please provide titel and contents for the post" });
  } else {
    Post.insert(newPost)
      .then((post) => {
        res.status(201).json(post);
      })
      .catch(() => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

// [PUT] /api/posts/:id

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  try {
    if (!changes.title || !changes.contents) {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
    } else {
      const updatePost = await Post.update(id, changes);
      if (!updatePost) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(updatePost);
      }
    }
  } catch {
    res
      .status(500)
      .json({ message: "The post information could not be modified" });
  }
});

// [DELETE] /api/posts/:id

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const removed = await Post.remove(id);
    if (!removed) {
      res
        .status(404)
        .json({ message: "The post iwth the specified ID does not exist" });
    } else {
      res.json(removed);
    }
  } catch {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

module.exports = router;
