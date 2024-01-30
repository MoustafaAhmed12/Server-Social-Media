const postController = {};
const Post = require("../../models/post.model");
const User = require("../../models/user.model");
const Joi = require("@hapi/joi");

const updateValidation = (post) => {
  const schema = Joi.object({
    desc: Joi.string().required("First Name is Required Field").min(1),
  });
  const validation = schema.validate(post);
  return validation;
};
//create a post
postController.createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    const getPost = await Post.findById(savedPost._id);
    res.status(200).json(getPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Post
postController.updatePost = async (req, res) => {
  const { desc, userId } = req.body;
  const { error } = updateValidation({
    desc,
  });
  if (error) return res.status(401).json({ msg: error.details[0].message });
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      userId,
      desc,
    });
    res.status(200).json(post);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};
postController.updateCommentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    await Post.findByIdAndUpdate(req.params.id, {
      comments: [...post.comments, req.body.commentId],
    });
    res.status(200).json("Posts has been updated");
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Delete Post
postController.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.deleteOne();
    res.status(200).json("the post has been deleted");
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Like / disLike Post
postController.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// getPost
postController.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "userId",
        model: "User",
        select: "username name surname profilePicture",
      })
      .populate({
        path: "comments",
        model: "Comment",
        populate: {
          path: "userId",
          model: "User",
          select: "username name surname profilePicture",
        },
      });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// getPosts
postController.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate({ path: "comments", model: "Comment" })
      .populate({
        path: "userId",
        select: "username name surname profilePicture",
      })
      .sort({
        createdAt: -1,
      });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

postController.timelinePost = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id }).populate({
      path: "userId",
      select: "username name surname profilePicture",
    });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId })
          .populate({
            path: "userId",
            select: "username name surname profilePicture",
          })
          .sort({
            createdAt: -1,
          });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get user's all posts

postController.getUserPost = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id }).populate({
      path: "userId",
      select: "username name surname profilePicture",
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = postController;
