// backend/routes/postRoutes.js

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
} from "../controllers/postController.js";

import protect from "../middleware/auth.js";

const router = express.Router();


// ========================================
// UPLOAD DIRECTORY
// ========================================

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// ========================================
// MULTER STORAGE
// ========================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      uniqueName + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


// ========================================
// GET ALL POSTS
// ========================================

router.get("/", protect, getPosts);


// ========================================
// GET USER POSTS
// ========================================

router.get("/user/:userId", protect, async (req, res) => {
  try {
    const Post = (await import("../models/postModel.js")).default;

    const posts = await Post.find({
      author: req.params.userId,
    })
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Get user posts error:", error);

    res.status(500).json({
      message: "Failed to fetch user posts",
    });
  }
});


// ========================================
// GET SINGLE POST
// ========================================

router.get("/:id", protect, getPostById);


// ========================================
// CREATE POST
// ========================================

router.post(
  "/",
  protect,
  upload.single("image"),
  createPost
);


// ========================================
// UPDATE POST
// ========================================

router.put(
  "/:id",
  protect,
  upload.single("image"),
  updatePost
);


// ========================================
// DELETE POST
// ========================================

router.delete(
  "/:id",
  protect,
  deletePost
);


// ========================================
// LIKE / UNLIKE POST
// ========================================

router.put(
  "/:id/like",
  protect,
  likePost
);


// ========================================
// COMMENT ON POST
// ========================================

router.post(
  "/:id/comment",
  protect,
  addComment
);


export default router;