const userController = {};
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");
const Joi = require("@hapi/joi");

const updateValidation = (user) => {
  const schema = Joi.object({
    name: Joi.string().required("First Name is Required Field").min(3),
    surname: Joi.string().required("Last Name is Required Field").min(3),
    bio: Joi.string().required("bio is Required Field").min(3).max(200),
  });
  const validation = schema.validate(user);
  return validation;
};

userController.updateUser = async (req, res) => {
  const { name, surname, bio } = req.body;
  const { error } = updateValidation({
    name,
    surname,
    bio,
  });
  if (error) return res.status(401).json({ msg: error.details[0].message });
  try {
    await User.findByIdAndUpdate(req.params.userId, {
      name: req.body.name,
      surname: req.body.surname,
      bio: req.body.bio,
    });
    res.status(200).json("Account has been updated");
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

// Update Posts
userController.updateUserPosts = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      await User.findByIdAndUpdate(req.params.id, {
        posts: [...user.posts, req.body.postId],
      });
      res.status(200).json("Posts has been updated");
    } catch (err) {
      return res.status(500).json(err.message);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
};

//get a user
userController.getUser = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findOne({ _id: userId }).populate("posts")
      : await User.findOne({ username: username }).populate("posts");
    const { password, updatedAt, email, isAdmin, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get All Users
userController.getAllUsers = async (req, res) => {
  const { userId } = req.params;
  try {
    const currentUser = await User.findById(userId);
    const allUsers = await User.find({}).populate("posts");
    const users = allUsers.filter(
      (u) => !currentUser.followings?.includes(u._id)
    );

    res.status(200).send(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

//get Followings
userController.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, name, surname, profilePicture } = friend;
      friendList.push({ _id, username, name, surname, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get Followers
userController.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    const follower = await Promise.all(
      user.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let followerList = [];
    follower.map((friend) => {
      const { _id, username, name, surname, profilePicture } = friend;
      followerList.push({ _id, username, name, surname, profilePicture });
    });
    res.status(200).json(followerList);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//follow a user
userController.followUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json({ msg: "user has been followed" });
      } else {
        res.status(403).json({ msg: "you allready follow this user" });
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    res.status(403).json({ msg: "you cant follow yourself" });
  }
};

userController.unfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json({ msg: "user has been unfollowed" });
      } else {
        res.status(403).json({ msg: "you dont follow this user" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json({ msg: "you cant unfollow yourself" });
  }
};

module.exports = userController;
