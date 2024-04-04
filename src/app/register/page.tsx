"use client";

import { useEffect, useState } from "react";
import "./register.css"; // Import the CSS file
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Register = () => {    
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [name, setname] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://cheetah-production.up.railway.app/api/v1/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name,
            email,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      console.log(data.message);

      if (data.success) {
        toast.success("User successfully register");
        Cookies.set("token", data.authToken, { expires: 2 }); // Set the cookie named 'token' with a value and expiry time

        setTimeout(() => {
          router.push("/"); // Redirect to home page after displaying the toast
        }, 1000);
      } else {
        console.log(data);
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log("Error: " + error);
      if (error.response && error.response.status === 401) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while Registering user");
      }
    }
  };

  const authToken = Cookies.get("token");

  useEffect(() => {
    if (authToken) {
      router.push("/");
    }
  }, []);

  if (authToken) {
    return null;
  }

  return (
    <div className="container">
      {/* Apply container class */}
      <ToastContainer />

      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="inputdiv">
          <input
            placeholder="Enter name"
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </div>
        <div className="inputdiv">
          <input
            placeholder="Enter Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="inputdiv">
          <input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="inputdiv">
          <input
            placeholder="Enter comfirmpassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
        </div>
        <div className="btn">
          <button type="submit">Register</button>
        </div>
        <Link href="/login" scroll={false} className="register">
          Already have account ?
        </Link>
      </form>
    </div>
  );
};

export default Register;
