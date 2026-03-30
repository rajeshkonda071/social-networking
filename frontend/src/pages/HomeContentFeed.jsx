import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function HomeContentFeed() {
  const [posts, setPosts] = useState([]);
  const [desc, setDesc] = useState("");
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/posts/timeline/${user._id}`);
        setPosts(res.data.sort((p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPosts();
  }, [user._id]);

  const submitPost = async (e) => {
    e.preventDefault();
    if (!desc) return;
    const newPost = {
      userId: user._id,
      desc: desc,
    };
    try {
      const res = await axios.post("http://localhost:8800/api/posts", newPost);
      setPosts([res.data, ...posts]);
      setDesc("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="feed-container">
      <div className="topbar">
        <Link to="/" className="topbar-logo">Antigravity Social</Link>
        <div className="topbar-right">
          <Link to={`/profile/${user._id}`}>
            <img
              src={user.profilePicture || "https://ui-avatars.com/api/?name=" + user.username}
              alt=""
              className="topbar-profile-img"
            />
          </Link>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      <div className="share-container">
        <form className="share-wrapper" onSubmit={submitPost}>
          <div className="share-input-wrapper">
            <img
              src={user.profilePicture || "https://ui-avatars.com/api/?name=" + user.username}
              alt=""
            />
            <input
              placeholder={"What's on your mind, " + user.username + "?"}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>
          <hr className="share-hr" />
          <div className="share-bottom">
            <button type="submit">Share</button>
          </div>
        </form>
      </div>

      {posts.map((p) => (
        <Post key={p.createdAt || p._id} post={p} currentUser={user} />
      ))}
    </div>
  );
}

function Post({ post, currentUser }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/users/${post.userId}`);
        setUser(res.data);
      } catch (err) {}
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put(`http://localhost:8800/api/posts/${post._id}/like`, { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="post">
      <div className="post-wrapper">
        <div className="post-top">
          <Link to={`/profile/${post.userId}`} className="post-top-left">
            <img
              src={user.profilePicture || "https://ui-avatars.com/api/?name=" + (user.username || "U")}
              alt=""
              className="post-profile-img"
            />
            <span className="post-username">{user.username}</span>
            <span className="post-date">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Just now'}
            </span>
          </Link>
        </div>
        <div className="post-center">
          <span className="post-text">{post.desc}</span>
        </div>
        <div className="post-bottom">
          <div className="post-like-icon" onClick={likeHandler}>
            {isLiked ? "❤️" : "🤍"}
          </div>
          <span className="post-like-counter">{like} likes</span>
        </div>
      </div>
    </div>
  );
}
