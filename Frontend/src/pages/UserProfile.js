// frontend/src/pages/UserProfile.js

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import { format } from "timeago.js";
import "./UserProfile.css";

const UserProfile = () => {
  const { id } = useParams();

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");


  // ========================================
  // FETCH PROFILE
  // ========================================

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await API.getUserProfile(id, token);

      setUserData(data.user);
      setPosts(data.posts || []);


      // Get current logged-in user
      const currentUser = await API.getCurrentUser(token);

      const following =
        currentUser.following || [];

      const followingUser = following.some(
        (userId) =>
          userId.toString() === id.toString()
      );

      setIsFollowing(followingUser);


      // If private and request exists
      const requests =
        data.user.followRequests || [];

      const requested = requests.some(
        (userId) =>
          userId.toString() ===
          currentUser._id.toString()
      );

      if (requested) {
        setFollowStatus("requested");
      } else if (followingUser) {
        setFollowStatus("following");
      } else {
        setFollowStatus("");
      }

    } catch (error) {
      console.error(
        "Error fetching user profile:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load profile"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (token && id) {
      fetchUserProfile();
    }
  }, [id]);


  // ========================================
  // FOLLOW
  // ========================================

  const handleFollow = async () => {
    try {
      setActionLoading(true);

      const response =
        await API.followUser(id, token);

      if (response.status === "requested") {
        setFollowStatus("requested");
      } else {
        setFollowStatus("following");
        setIsFollowing(true);
      }

      await fetchUserProfile();

    } catch (error) {
      console.error(
        "Error following user:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to follow user"
      );

    } finally {
      setActionLoading(false);
    }
  };


  // ========================================
  // UNFOLLOW
  // ========================================

  const handleUnfollow = async () => {
    try {
      setActionLoading(true);

      await API.unfollowUser(id, token);

      setIsFollowing(false);
      setFollowStatus("");

      await fetchUserProfile();

    } catch (error) {
      console.error(
        "Error unfollowing user:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to unfollow user"
      );

    } finally {
      setActionLoading(false);
    }
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (error || !userData) {
    return (
      <div className="user-profile-page">
        <div className="profile-error">
          <div>😕</div>

          <h2>Unable to load profile</h2>

          <p>
            {error || "User not found"}
          </p>

          <Link
            to="/search"
            className="back-search-btn"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }


  // ========================================
  // PROFILE
  // ========================================

  const username =
    userData.username || "User";

  const followers =
    userData.followers?.length || 0;

  const following =
    userData.following?.length || 0;


  return (
    <div className="user-profile-page">

      <div className="user-profile-wrapper">

        {/* =================================
            PROFILE HEADER
        ================================= */}

        <div className="user-profile-card">

          <div className="profile-avatar">

            {userData.profilePicture ? (
              <img
                src={`http://localhost:5000/${userData.profilePicture}`}
                alt={username}
              />
            ) : (
              username
                .charAt(0)
                .toUpperCase()
            )}

          </div>


          <div className="profile-info">

            <h1>
              {username}
            </h1>

            <p className="profile-email">
              {userData.email}
            </p>

            <div className="profile-stats">

              <div>
                <strong>
                  {posts.length}
                </strong>
                <span>Posts</span>
              </div>

              <div>
                <strong>
                  {followers}
                </strong>
                <span>Followers</span>
              </div>

              <div>
                <strong>
                  {following}
                </strong>
                <span>Following</span>
              </div>

            </div>


            {/* FOLLOW BUTTON */}

            {isFollowing ? (

              <button
                className="unfollow-btn"
                onClick={handleUnfollow}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Please wait..."
                  : "Following"}
              </button>

            ) : followStatus === "requested" ? (

              <button
                className="requested-btn"
                disabled
              >
                Requested
              </button>

            ) : (

              <button
                className="follow-btn"
                onClick={handleFollow}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Please wait..."
                  : "Follow"}
              </button>

            )}

          </div>

        </div>


        {/* =================================
            BIO
        ================================= */}

        {userData.bio && (
          <div className="profile-bio">
            {userData.bio}
          </div>
        )}


        {/* =================================
            POSTS HEADER
        ================================= */}

        <div className="profile-post-heading">

          <span>▦</span>

          <h2>
            {username}'s Posts
          </h2>

        </div>


        {/* =================================
            PRIVATE ACCOUNT
        ================================= */}

        {userData.isPrivate &&
          posts.length === 0 ? (

          <div className="private-profile">

            <div className="private-icon">
              🔒
            </div>

            <h3>
              This account is private
            </h3>

            <p>
              Follow this account to see
              their posts.
            </p>

          </div>

        ) : posts.length === 0 ? (

          <div className="private-profile">

            <div className="private-icon">
              📷
            </div>

            <h3>
              No posts yet
            </h3>

            <p>
              This user hasn't shared
              anything yet.
            </p>

          </div>

        ) : (

          /* =================================
             POSTS
          ================================= */

          <div className="profile-posts-grid">

            {posts.map((post) => (

              <div
                key={post._id}
                className="profile-post"
              >

                {post.image ? (

                  <img
                    src={`http://localhost:5000${post.image}`}
                    alt={post.title}
                    className="profile-post-image"
                    onError={(e) => {
                      e.target.style.display =
                        "none";
                    }}
                  />

                ) : (

                  <div className="text-post">

                    <h3>
                      {post.title}
                    </h3>

                    <p>
                      {post.content}
                    </p>

                  </div>

                )}

                <div className="post-overlay">

                  <span>
                    ❤️ {post.likes?.length || 0}
                  </span>

                  <span>
                    💬 {post.comments?.length || 0}
                  </span>

                </div>

                <div className="post-info">

                  <h3>
                    {post.title}
                  </h3>

                  <p>
                    {post.content}
                  </p>

                  <small>
                    {format(post.createdAt)}
                  </small>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default UserProfile;