import { useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { dispatch, isFetching } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", {
        email: email.current.value,
        password: password.current.value,
      });
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <h2>Antigravity Social</h2>
        <form onSubmit={handleClick}>
          <input placeholder="Email" type="email" required ref={email} />
          <input
            placeholder="Password"
            type="password"
            required
            minLength="6"
            ref={password}
          />
          <button type="submit" disabled={isFetching}>
            {isFetching ? "Loading..." : "Log In"}
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <span onClick={() => navigate("/register")}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}
