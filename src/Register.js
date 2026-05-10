import React, {
  useState
} from "react";

import axios from "axios";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");



  const registerUser =
    async () => {

      try {

        await axios.post(

          "https://chat-app-backend-i1z3.onrender.com/api/auth/register",

          {
            name,
            email,
            password,
          }
        );

        alert(
          "Registration Successful"
        );

        window.location.href = "/";

      } catch (error) {

        alert("Error");
      }
  };



  return (

    <div style={{
      textAlign: "center",
      marginTop: "100px",
    }}>

      <h1>Register</h1>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <br /><br />

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

      <button
        onClick={registerUser}
      >
        Register
      </button>

    </div>
  );
}

export default Register;