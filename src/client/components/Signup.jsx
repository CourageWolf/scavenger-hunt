import React, { Component, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function Signup(props) {
  const onSubmit = (values) => {
    const data = {
      user_name: values.user_name,
      password: values.password,
    };

    axios.post("http://localhost:3000/api/users", data).then((res) => {
      if (res.status === 200) {
        alert("Account successfully created. Return to Login");
        props.history.push("/");
      } else {
        alert("Error creating account");
      }
    });
  };

  const { register, handleSubmit } = useForm();

  return (
   
      <div className="login-container">
        <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
          Signup
          <div>
            <label>Username</label>
            <input className='input' name="user_name" ref={register} />
          </div>

          <div>
            <label>Password</label>
            <input className='input' name="password" type="password" ref={register} />
          </div>

          <input type="submit"></input>
        </form>
      </div>
  
  );
}

export default Signup;
