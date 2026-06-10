import { useState } from "react";
import axios from "axios";

function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const login = async () => {
    try {
      const res = await axios.post(
        "http://13.201.27.55:8000/login"
        user
      );

      alert(res.data.message);

      console.log("LOGIN WORKED");
      console.log("REDIRECTING...");
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("username", user.username);
window.location.replace("/");

    } catch (error) {
      alert("Invalid Credentials");
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>🔐 Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={user.username}
        onChange={(e) =>
          setUser({
            ...user,
            username: e.target.value,
          })
        }
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={user.password}
        onChange={(e) =>
          setUser({
            ...user,
            password: e.target.value,
          })
        }
      />

      <br />
      <br />

      <button onClick={login}>
        Login
      </button>

      <br />
      <br />

      <a href="/signup">
        Don't have an account? Signup
      </a>
    </div>
  );
}

export default Login;
