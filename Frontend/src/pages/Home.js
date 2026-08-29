import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentValues, setCommentValues] = useState({});

  // ========================================
  // FETCH POSTS
  // ========================================

  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);


  // ========================================
  // COMMENT INPUT
  // ========================================

  const handleCommentChange = useCallback(
    (postId, value) => {
      setCommentValues((prev) => ({
        ...prev,
        [postId]: value,
      }));
    },
    []
  );


  // ========================================
  // ADD COMMENT
  // ========================================

  const handleComment = useCallback(
    async (postId) => {
      try {
        const token = localStorage.getItem("token");

        const text = commentValues[postId]?.trim();

        if (!text) return;

        await axios.post(
          `http://localhost:5000/api/posts/${postId}/comment`,
          {
            text,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCommentValues((prev) => ({
          ...prev,
          [postId]: "",
        }));

        await fetchPosts();

      } catch (error) {
        console.error(
          "Error adding comment:",
          error
        );
      }
    },
    [commentValues, fetchPosts]
  );


  // ========================================
  // LIKE / UNLIKE POST
  // ========================================

  const handleLike = useCallback(
    async (postId) => {
      try {
        const token = localStorage.getItem("token");

        await axios.post(
          `http://localhost:5000/api/posts/${postId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchPosts();

      } catch (error) {
        console.error(
          "Error liking post:",
          error
        );
      }
    },
    [fetchPosts]
  );


  // ========================================
  // DELETE POST
  // ========================================

  const handleDelete = useCallback(
    async (postId) => {
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

        // Remove immediately from screen
        setPosts((prev) =>
          prev.filter((post) => post._id !== postId)
        );

      } catch (error) {
        console.error(
          "Error deleting post:",
          error
        );
      }
    },
    []
  );


  // ========================================
  // UI
  // ========================================

  return (
    <div className="home-page">

      {/* HOME HEADER */}

      <div className="home-header">

        <h1>
          Social Feed
        </h1>

        <p>
          See what people are sharing
        </p>

      </div>


      {/* POSTS */}

      {posts.length === 0 ? (

        <div className="empty-home">

          <div className="empty-home-icon">
            +
          </div>

          <h3>
            No posts yet
          </h3>

          <p>
            Create your first post and
            share something with everyone.
          </p>

        </div>

      ) : (

        <div className="home-feed">

          {posts.map((post) => (

            <PostCard
              key={post._id}
              post={post}

              commentValue={
                commentValues[post._id] || ""
              }

              onCommentChange={(e) =>
                handleCommentChange(
                  post._id,
                  e.target.value
                )
              }

              onComment={() =>
                handleComment(post._id)
              }

              onLike={() =>
                handleLike(post._id)
              }

              onDelete={() =>
                handleDelete(post._id)
              }
            />

          ))}

        </div>

      )}

    </div>
  );
};

export default Home;