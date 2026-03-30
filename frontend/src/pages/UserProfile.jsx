import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function UserProfile() {
  const [user, setUser] = useState({});
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/users/${id}`);
        setUser(res.data);
        setFollowed(res.data.followers.includes(currentUser._id));
      } catch (err){
      }
    };
    fetchUser();
  }, [id, currentUser._id]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`http://localhost:8800/api/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
      } else {
        await axios.put(`http://localhost:8800/api/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
      }
      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app-container">
      <div className="topbar">
        <Link to="/" className="topbar-logo">Antigravity Social</Link>
      </div>
      <div className="profile-container">
        <div className="profile-cover">
          <div className="profile-info">
            <img
              className="profile-user-img"
              src={user.profilePicture || "https://ui-avatars.com/api/?name=" + (user.username || "U")}
              alt=""
            />
            <h4>{user.username}</h4>
            <span>{user.desc || "Hello, I am using Antigravity Framework."}</span>
            {user._id && currentUser._id && user._id !== currentUser._id && (
              <button style={{ marginTop: "20px", width: "200px" }} onClick={handleClick}>
                {followed ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
