import { useState } from "react";
import axios from "axios";

function Signup() {

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const signup = async () => {
    try {

      const res = await axios.post(
        "http://13.201.27.55:8000/signup"
        user
      );

      alert(res.data.message);

    } catch (error) {
      alert("Signup Failed");
    }
  };

  return (
    <div className="container">

      <h1>Signup</h1>

      <input
        placeholder="Username"
        onChange={(e) =>
          setUser({
            ...user,
            username: e.target.value,
          })
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setUser({
            ...user,
            password: e.target.value,
          })
        }
      />

      <br /><br />

      <button onClick={signup}>
        Signup
      </button>

    </div>
  );
}

export default Signup;