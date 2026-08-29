import axios from "axios";

const BASE = "http://localhost:5000/api";

const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});


// ========================================
// AUTH
// ========================================

const register = async (payload) => {
  const response = await axios.post(
    `${BASE}/auth/register`,
    payload
  );

  return response.data;
};


const login = async (payload) => {
  const response = await axios.post(
    `${BASE}/auth/login`,
    payload
  );

  return response.data;
};


// ========================================
// USER
// ========================================

// Current logged-in user
const getCurrentUser = async (token) => {
  const response = await axios.get(
    `${BASE}/user/me`,
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// Search users
const searchUsers = async (query, token) => {
  const response = await axios.get(
    `${BASE}/user/search?query=${encodeURIComponent(query)}`,
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// Get another user's profile
const getUserProfile = async (userId, token) => {
  const response = await axios.get(
    `${BASE}/user/${userId}`,
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// Follow / Follow Request
const followUser = async (userId, token) => {
  const response = await axios.post(
    `${BASE}/user/${userId}/follow`,
    {},
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// Unfollow
const unfollowUser = async (userId, token) => {
  const response = await axios.delete(
    `${BASE}/user/${userId}/follow`,
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// ========================================
// POSTS
// ========================================

// Get all posts
const getPosts = async (token) => {
  const response = await axios.get(
    `${BASE}/posts`,
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// Create post
const createPost = async (data, token) => {
  const response = await axios.post(
    `${BASE}/posts`,
    data,
    {
      headers: {
        ...authHeader(token),
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// Like / Unlike
const likePost = async (id, token) => {
  const response = await axios.put(
    `${BASE}/posts/${id}/like`,
    {},
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// Add comment
const commentPost = async (id, text, token) => {
  const response = await axios.post(
    `${BASE}/posts/${id}/comment`,
    {
      text,
    },
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// Delete post
const deletePost = async (id, token) => {
  const response = await axios.delete(
    `${BASE}/posts/${id}`,
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// Get my posts
const getMyPosts = async (token) => {
  const response = await axios.get(
    `${BASE}/posts/user/me`,
    {
      headers: authHeader(token),
    }
  );

  return response.data;
};


// ========================================
// EXPORT
// ========================================

const API = {
  // Auth
  register,
  login,

  // User
  getCurrentUser,
  searchUsers,
  getUserProfile,
  followUser,
  unfollowUser,

  // Posts
  getPosts,
  createPost,
  likePost,
  commentPost,
  deletePost,
  getMyPosts,
};

export default API;