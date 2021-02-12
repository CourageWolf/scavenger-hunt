import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AppContext } from "./ContextProvider";
import axios from "axios";

function Login(props) {
  const { user, setCurrentUser } = useContext(AppContext);
  const { register, handleSubmit } = useForm();

  const onSubmit = (userConfig) => {
    axios
      .post(`http://localhost:3000/api/users/auth/`, {
        user_name: userConfig.user_name,
        password: userConfig.user_password,
      })
      .then((res) => {
        if (res.data.length > 0) {
          setCurrentUser(res.data[0]);
          props.history.push("/hunts");
        } else {
          alert("Wrong username or password entered");
        }
      });
  };

  return (
    <div className="login-container">
      <form className= "login-container" onSubmit={handleSubmit(onSubmit)}>
        Login
        <div>
          <label>Username</label>
          <input className="input" name="user_name" ref={register} />
        </div>

        <div>
          <label>Password</label>
          <input className="input" name="user_password" type="password" ref={register} />
        </div>

        <div className="submitBtn">
          <input className="generic_button" type="submit"></input>
        </div>
      </form>
      Not registered?
      <br />
      <Link to="/signup">Create an Account</Link>
      <Link to="/hunts"> Continue as Guest </Link>
    </div>
  );
}

export default Login;
