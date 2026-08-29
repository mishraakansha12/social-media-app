// backend/routes/userRoutes.js

import express from "express";

import {
  togglePrivacy,
  requestOrFollow,
  acceptFollow,
  rejectFollow,
  unfollowUser,
  getMyFollowRequests,
  getUserProfileWithPrivacy,
  searchUsers,
} from "../controllers/userController.js";

import protect from "../middleware/auth.js";

const router = express.Router();


// ========================================
// MY PROFILE
// GET /api/user/me
// ========================================

router.get("/me", protect, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Get my profile error:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
});


// ========================================
// SEARCH USERS
// GET /api/user/search?query=
// ========================================

router.get(
  "/search",
  protect,
  searchUsers
);


// ========================================
// PRIVACY
// PUT /api/user/privacy
// ========================================

router.put(
  "/privacy",
  protect,
  togglePrivacy
);


// ========================================
// FOLLOW REQUESTS
// ========================================

router.get(
  "/follow-requests",
  protect,
  getMyFollowRequests
);


// ========================================
// FOLLOW USER
// POST /api/user/:id/follow
// ========================================

router.post(
  "/:id/follow",
  protect,
  requestOrFollow
);


// ========================================
// ACCEPT FOLLOW REQUEST
// POST /api/user/:id/accept
// ========================================

router.post(
  "/:id/accept",
  protect,
  acceptFollow
);


// ========================================
// REJECT FOLLOW REQUEST
// POST /api/user/:id/reject
// ========================================

router.post(
  "/:id/reject",
  protect,
  rejectFollow
);


// ========================================
// UNFOLLOW USER
// DELETE /api/user/:id/follow
// ========================================

router.delete(
  "/:id/follow",
  protect,
  unfollowUser
);


// ========================================
// OTHER USER PROFILE
// GET /api/user/:id
// ========================================

router.get(
  "/:id",
  protect,
  getUserProfileWithPrivacy
);


export default router;