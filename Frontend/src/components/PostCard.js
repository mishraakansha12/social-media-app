// frontend/src/components/PostCard.js

import React, { useState } from "react";
import { format } from "timeago.js";
import "./PostCard.css";

const PostCard = ({
  post,
  commentValue,
  onCommentChange,
  onComment,
  onLike,
  onDelete,
  currentUserId,
}) => {
  const imageUrl = post.image
    ? `http://localhost:5000${post.image}`
    : null;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="post-card">

      {/* ================= IMAGE ================= */}

      {imageUrl && (
        <>
          <div
            className="image-container"
            onClick={() => setIsModalOpen(true)}
            title="Click to view full image"
          >
            <img
              src={imageUrl}
              alt={post.title || "Post"}
              className="post-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* IMAGE MODAL */}

          {isModalOpen && (
            <div
              className="modal-overlay"
              onClick={() => setIsModalOpen(false)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={imageUrl}
                  alt={post.title || "Post"}
                  className="modal-image"
                />

                <button
                  className="modal-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </>
      )}


      {/* ================= POST CONTENT ================= */}

      <div className="post-main-content">

        <p className="post-time">
          {format(post.createdAt)}
        </p>

        <h3 className="post-title">
          {post.title}
        </h3>

        <p className="post-content">
          {post.description || post.content}
        </p>


        {/* ================= ACTION BAR ================= */}

        <div className="post-actions">

          <span className="like-count">
            {post.likes?.length || 0} Likes
          </span>

          <button
            onClick={onLike}
            className="like-btn"
          >
            Like
          </button>

          {/* DELETE */}

          {post.author?._id === currentUserId && (
            <button
              onClick={onDelete}
              className="delete-btn"
            >
              Delete
            </button>
          )}

        </div>


        {/* ================= COMMENTS ================= */}

        <div className="comment-section">

          <h4>
            Comments
          </h4>

          {post.comments?.length > 0 ? (

            post.comments.map((comment, idx) => (

              <div
                className="comment"
                key={comment._id || idx}
              >
                {comment.text}
              </div>

            ))

          ) : (

            <p className="no-comments">
              No comments yet.
            </p>

          )}


          {/* COMMENT INPUT */}

          <div className="comment-input">

            <input
              type="text"
              value={commentValue}
              onChange={onCommentChange}
              placeholder="Write a comment..."
            />

            <button
              type="button"
              onClick={onComment}
            >
              Post
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PostCard;