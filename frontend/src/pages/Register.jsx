import axios from "axios";
import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("http://localhost:8800/api/auth/register", user);
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <h2>Sign Up for Antigravity</h2>
        <form onSubmit={handleClick}>
          <input placeholder="Username" required ref={username} />
          <input placeholder="Email" type="email" required ref={email} />
          <input
            placeholder="Password"
            type="password"
            required
            minLength="6"
            ref={password}
          />
          <input
            placeholder="Password Again"
            type="password"
            required
            ref={passwordAgain}
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="auth-link">
          Already have an account? <span onClick={() => navigate("/login")}>Log In</span>
        </div>
      </div>
    </div>
  );
}
