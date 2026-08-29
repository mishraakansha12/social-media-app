// frontend/src/pages/Profile.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  // ========================================
  // FETCH PROFILE + POSTS
  // ========================================

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        // Get current user
        const resUser = await axios.get(
          "http://localhost:5000/api/user/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(resUser.data);

        // Get user's posts
        const resPosts = await axios.get(
          `http://localhost:5000/api/posts/user/${resUser.data._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPosts(resPosts.data);

      } catch (err) {
        console.error("Profile error:", err);

        setError(
          err.response?.data?.message ||
          "Failed to load profile"
        );
      }
    };

    fetchProfileData();
  }, []);


  // ========================================
  // DELETE POST
  // ========================================

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove post immediately from UI
      setPosts((prevPosts) =>
        prevPosts.filter(
          (post) => post._id !== postId
        )
      );

    } catch (err) {
      console.error("Delete post error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to delete post"
      );
    }
  };


  // ========================================
  // LOADING
  // ========================================

  if (!user && !error) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="profile-error">
        <div className="error-icon">⚠️</div>

        <h3>
          Unable to load profile
        </h3>

        <p>
          {error}
        </p>
      </div>
    );
  }


  // ========================================
  // PROFILE PAGE
  // ========================================

  return (
    <div className="profile-page">

      {/* ==================================
          PROFILE HEADER
      ================================== */}

      <div className="profile-header">

        <div className="profile-avatar">
          {user?.profilePicture ? (
            <img
              src={
                user.profilePicture.startsWith("http")
                  ? user.profilePicture
                  : `http://localhost:5000${
                      user.profilePicture.startsWith("/")
                        ? user.profilePicture
                        : `/${user.profilePicture}`
                    }`
              }
              alt={user.username || "Profile"}
            />
          ) : (
            user?.username
              ? user.username
                  .charAt(0)
                  .toUpperCase()
              : "U"
          )}
        </div>


        <div className="profile-info">

          <h2>
            {user?.username || "User"}
          </h2>

          <p className="profile-email">
            {user?.email}
          </p>


          {/* STATS */}

          <div className="profile-stats">

            <div className="profile-stat">
              <strong>
                {posts.length}
              </strong>

              <span>
                Posts
              </span>
            </div>


            <div className="profile-stat">
              <strong>
                {user?.followers?.length || 0}
              </strong>

              <span>
                Followers
              </span>
            </div>


            <div className="profile-stat">
              <strong>
                {user?.following?.length || 0}
              </strong>

              <span>
                Following
              </span>
            </div>

          </div>

        </div>

      </div>


      {/* ==================================
          MY POSTS
      ================================== */}

      <div className="profile-posts">

        <div className="posts-heading">
          <span>▦</span>

          <h3>
            My Posts
          </h3>
        </div>


        {/* NO POSTS */}

        {posts.length === 0 ? (

          <div className="empty-posts">

            <div className="empty-icon">
              📷
            </div>

            <h3>
              No posts yet
            </h3>

            <p>
              Create your first post and share
              something with the community.
            </p>

          </div>

        ) : (

          /* ==================================
             POSTS GRID
          ================================== */

          <div className="profile-post-grid">

            {posts.map((post) => (

              <div
                key={post._id}
                className="profile-post-card"
              >

                {/* IMAGE */}

                {post.image && (

                  <div className="profile-image-wrapper">

                    <img
                      src={
                        post.image.startsWith("http")
                          ? post.image
                          : `http://localhost:5000${
                              post.image.startsWith("/")
                                ? post.image
                                : `/${post.image}`
                            }`
                      }
                      alt={
                        post.title || "Post"
                      }
                      className="profile-post-image"

                      onError={(e) => {
                        e.target.style.display =
                          "none";
                      }}
                    />

                  </div>

                )}


                {/* CONTENT */}

                <div className="profile-post-content">

                  {post.title && (
                    <h4>
                      {post.title}
                    </h4>
                  )}

                  <p>
                    {post.content ||
                      post.text ||
                      ""}
                  </p>

                </div>


                {/* DELETE BUTTON */}

                <button
                  type="button"
                  className="profile-delete-btn"
                  onClick={() =>
                    handleDelete(post._id)
                  }
                >
                  🗑 Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Profile;