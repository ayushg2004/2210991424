const axios = require("axios");
const { fetchToken } = require("./authService");
require("dotenv").config();

const analyzeUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const token = await fetchToken();

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const postsResponse = await axios.get(`${process.env.BASE_URL}/posts`, {
      headers,
    });
    const userPosts = postsResponse.data.filter(
      (post) => post.userId === parseInt(userId)
    );

    if (userPosts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    let totalLikes = 0;
    let totalComments = 0;
    let mostLikedPost = null;
    let mostCommentedPost = null;

    for (const post of userPosts) {
      totalLikes += post.likes || 0;

      const commentsResponse = await axios.get(
        `${process.env.BASE_URL}/posts/${post.id}/comments`,
        { headers }
      );
      const comments = commentsResponse.data;
      const commentCount = comments.length;
      totalComments += commentCount;

      if (!mostLikedPost || post.likes > mostLikedPost.likes) {
        mostLikedPost = post;
      }

      if (!mostCommentedPost || commentCount > mostCommentedPost.commentCount) {
        mostCommentedPost = {
          ...post,
          commentCount: commentCount,
        };
      }
    }

    const avgLikes = totalLikes / userPosts.length;
    const avgComments = totalComments / userPosts.length;

    res.json({
      userId,
      totalPosts: userPosts.length,
      averageLikes: avgLikes.toFixed(2),
      averageComments: avgComments.toFixed(2),
      mostLikedPost,
      mostCommentedPost,
    });
  } catch (err) {
    console.error("Error during analysis:", err.message);
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};

module.exports = { analyzeUser };
