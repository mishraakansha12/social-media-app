// frontend/src/pages/CreatePost.js

import React, { useState } from "react";
import axios from "axios";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ========================================
  // IMAGE SELECT
  // ========================================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImage(null);
      setPreview("");
      return;
    }

    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };


  // ========================================
  // CREATE POST
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Reset form
      setTitle("");
      setContent("");
      setImage(null);
      setPreview("");

      alert("Post created successfully!");

    } catch (err) {
      console.error("Create post error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to create post"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="create-post-page">

      <div className="create-post-card">

        {/* HEADER */}

        <div className="create-post-header">

          <div className="create-post-icon">
            +
          </div>

          <div>
            <h2>Create a New Post</h2>

            <p>
              Share something with the community
            </p>
          </div>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="create-post-form"
        >

          {/* TITLE */}

          <div className="form-group">

            <label>
              Title
            </label>

            <input
              type="text"
              placeholder="Give your post a title..."
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

          </div>


          {/* CONTENT */}

          <div className="form-group">

            <label>
              Content
            </label>

            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              rows="6"
              required
            />

            <div className="character-count">
              {content.length} characters
            </div>

          </div>


          {/* IMAGE */}

          <div className="form-group">

            <label>
              Add an image
              <span className="optional">
                Optional
              </span>
            </label>

            <label className="image-upload-box">

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {!preview ? (
                <>

                  <div className="upload-icon">
                    ↑
                  </div>

                  <strong>
                    Choose an image
                  </strong>

                  <span>
                    JPG, PNG or other image formats
                  </span>

                </>
              ) : (
                <div className="preview-container">

                  <img
                    src={preview}
                    alt="Preview"
                    className="image-preview"
                  />

                  <span className="change-image">
                    Click to change image
                  </span>

                </div>
              )}

            </label>

          </div>


          {/* SUBMIT */}

          <button
            type="submit"
            className="create-post-btn"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="button-spinner"></span>
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}

          </button>

        </form>

      </div>

    </div>
  );
};

export default CreatePost;