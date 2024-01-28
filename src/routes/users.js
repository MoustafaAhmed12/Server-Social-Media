const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const postController = require("../controllers/post.controller");
const commentController = require("../controllers/comment.controller");

// Auth
router.post("/register", authController.register);
router.post("/login", authController.login);

// User
router.patch("/user/:userId", userController.updateUser);
router.patch("/user/:id/posts", userController.updateUserPosts);
router.delete("/user/:id", userController.deleteUser);
router.get("/user", userController.getUser);
router.get("/users", userController.getAllUsers);
router.get("/user/friends/:userId", userController.getFriends);
router.get("/user/follower/:userId", userController.getFollowers);
router.put("/user/:id/follow", userController.followUser);
router.put("/user/:id/unfollow", userController.unfollowUser);

// Post
router.post("/post", postController.createPost);
router.patch("/post/:id", postController.updatePost);
router.patch("/post/:id/comment", postController.updateCommentPost);
router.delete("/post/:id", postController.deletePost);
router.get("/post/:id", postController.getPost);
router.get("/posts", postController.getPosts);
router.put("/post/:id/like", postController.likePost);
router.get("/posts/timeline/:userId", postController.timelinePost);
router.get("/posts/profile/:username", postController.getUserPost);

// Comment
router.post("/comment", commentController.createComment);
router.get("/comment/:postId", commentController.getComment);
router.delete("/comment/:id", commentController.deleteComment);

module.exports = router;
