const commentController = {};

const Comment = require("./../../models/comment.model");

commentController.createComment = async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(401).json(err);
  }
};

commentController.getComment = async (req, res) => {
  try {
    const comment = await Comment.find({
      postId: req.params.postId,
    }).populate({
      path: "userId",
      model: "User",
      select: "username name surname profilePicture",
    });
    res.status(200).json(comment);
  } catch (err) {
    res.status(401).json(err);
  }
};

commentController.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    await comment.deleteOne();
    res.status(200).json("the post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = commentController;
