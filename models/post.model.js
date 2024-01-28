const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Post", PostSchema);
