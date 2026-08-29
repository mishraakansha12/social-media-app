// backend/controllers/userController.js

import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Notification from "../models/Notification.js";


// ========================================
// TOGGLE PRIVACY
// ========================================

export const togglePrivacy = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isPrivate = !user.isPrivate;

    await user.save();

    res.status(200).json({
      isPrivate: user.isPrivate,
    });

  } catch (error) {
    console.error("Toggle privacy error:", error);

    res.status(500).json({
      message: "Failed to update privacy",
    });
  }
};


// ========================================
// SEARCH USERS
// GET /api/user/search?query=
// ========================================

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    if (!query) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      $or: [
        {
          username: {
            $regex: query,
            $options: "i",
          },
        },
        {
          email: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .select("-password")
      .limit(20);

    res.status(200).json(users);

  } catch (error) {
    console.error("Search users error:", error);

    res.status(500).json({
      message: "Failed to search users",
    });
  }
};


// ========================================
// FOLLOW / FOLLOW REQUEST
// ========================================

export const requestOrFollow = async (req, res) => {
  try {
    const me = req.user._id;
    const targetId = req.params.id;

    if (me.toString() === targetId) {
      return res.status(400).json({
        message: "Cannot follow yourself",
      });
    }

    const meUser = await User.findById(me);
    const target = await User.findById(targetId);

    if (!meUser || !target) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // Already following
    if (target.followers.includes(me)) {
      return res.status(200).json({
        status: "following",
      });
    }


    // Private account
    if (target.isPrivate) {

      if (target.followRequests.includes(me)) {
        return res.status(200).json({
          status: "requested",
        });
      }

      target.followRequests.addToSet(me);

      await target.save();


      try {
        await Notification.create({
          user: targetId,
          from: me,
          type: "follow_request",
          text: "requested to follow you",
        });
      } catch (notificationError) {
        console.log(
          "Notification skipped:",
          notificationError.message
        );
      }


      return res.status(200).json({
        status: "requested",
      });
    }


    // Public account
    target.followers.addToSet(me);
    meUser.following.addToSet(targetId);

    await target.save();
    await meUser.save();


    try {
      await Notification.create({
        user: targetId,
        from: me,
        type: "follow",
        text: "started following you",
      });
    } catch (notificationError) {
      console.log(
        "Notification skipped:",
        notificationError.message
      );
    }


    res.status(200).json({
      status: "following",
    });

  } catch (error) {
    console.error("Follow error:", error);

    res.status(500).json({
      message: "Failed to follow user",
    });
  }
};


// ========================================
// ACCEPT FOLLOW REQUEST
// ========================================

export const acceptFollow = async (req, res) => {
  try {
    const me = req.user._id;
    const requesterId = req.params.id;

    const meUser = await User.findById(me);

    if (!meUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!meUser.followRequests.includes(requesterId)) {
      return res.status(400).json({
        message: "No such pending request",
      });
    }


    meUser.followRequests.pull(requesterId);
    meUser.followers.addToSet(requesterId);

    await meUser.save();


    await User.findByIdAndUpdate(
      requesterId,
      {
        $addToSet: {
          following: me,
        },
      }
    );


    try {
      await Notification.create({
        user: requesterId,
        from: me,
        type: "follow_accept",
        text: "accepted your follow request",
      });
    } catch (notificationError) {
      console.log(
        "Notification skipped:",
        notificationError.message
      );
    }


    res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("Accept follow error:", error);

    res.status(500).json({
      message: "Failed to accept follow request",
    });
  }
};


// ========================================
// REJECT FOLLOW REQUEST
// ========================================

export const rejectFollow = async (req, res) => {
  try {
    const me = req.user._id;
    const requesterId = req.params.id;

    const meUser = await User.findById(me);

    if (!meUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!meUser.followRequests.includes(requesterId)) {
      return res.status(400).json({
        message: "No such pending request",
      });
    }

    meUser.followRequests.pull(requesterId);

    await meUser.save();

    res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("Reject follow error:", error);

    res.status(500).json({
      message: "Failed to reject follow request",
    });
  }
};


// ========================================
// UNFOLLOW USER
// ========================================

export const unfollowUser = async (req, res) => {
  try {
    const me = req.user._id;
    const targetId = req.params.id;

    await User.findByIdAndUpdate(
      me,
      {
        $pull: {
          following: targetId,
        },
      }
    );

    await User.findByIdAndUpdate(
      targetId,
      {
        $pull: {
          followers: me,
        },
      }
    );

    res.status(200).json({
      success: true,
    });

  } catch (error) {
    console.error("Unfollow error:", error);

    res.status(500).json({
      message: "Failed to unfollow user",
    });
  }
};


// ========================================
// MY FOLLOW REQUESTS
// ========================================

export const getMyFollowRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate(
        "followRequests",
        "username email profilePicture"
      );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(
      user.followRequests || []
    );

  } catch (error) {
    console.error(
      "Follow requests error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch follow requests",
    });
  }
};


// ========================================
// GET USER PROFILE
// ========================================

export const getUserProfileWithPrivacy = async (
  req,
  res
) => {
  try {
    const viewerId = req.user?._id;
    const targetId = req.params.id;


    const user = await User.findById(targetId)
      .select("-password");


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    const canViewPosts =
      !user.isPrivate ||
      (
        viewerId &&
        viewerId.toString() ===
          user._id.toString()
      ) ||
      (
        viewerId &&
        user.followers
          .map(String)
          .includes(viewerId.toString())
      );


    let posts = [];


    if (canViewPosts) {
      posts = await Post.find({
        author: targetId,
      })
        .populate(
          "author",
          "username email"
        )
        .populate(
          "comments.author",
          "username email"
        )
        .sort({
          createdAt: -1,
        });
    }


    res.status(200).json({
      user,
      privacy: {
        isPrivate: user.isPrivate,
        canViewPosts,
      },
      posts,
    });

  } catch (error) {
    console.error(
      "Get user profile error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch user profile",
    });
  }
};