import React, {
  useState
} from "react";

import axios from "axios";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");



  const loginUser =
    async () => {

      try {

        const response =
          await axios.post(

          "https://chat-app-backend-i1z3.onrender.com/api/auth/login",

          {
            email,
            password,
          }
        );

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.data.user
          )
        );

        alert("Login Successful");

        window.location.href =
          "/chat";

      } catch (error) {

        alert(
          "Invalid Credentials"
        );
      }
  };



  return (

    <div style={{
      textAlign: "center",
      marginTop: "100px",
    }}>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <br /><br />

      <button onClick={loginUser}>
        Login
      </button>

      <br /><br />

      <a href="/register">
        Create Account
      </a>

    </div>
  );
}

export default Login;