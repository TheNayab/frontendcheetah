"use client";

import { useEffect, useState } from "react";
import styles from "./login.module.css"; // Import the CSS module
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://cheetah-production.up.railway.app/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("asdfasdfa " + JSON.stringify(data));

      if (data.success) {
        toast.success("User login successfully");
        Cookies.set("token", data.authToken, { expires: 2 }); // Set the cookie named 'token' with a value and expiry time

        router.push("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: any) {
      console.log("Error: " + error);
      if (error.response && error.response.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("An error occurred while logging in");
      }
    }
  };
  const authToken = Cookies.get("token");

  useEffect(() => {
    if (authToken) {
      router.push("/");
    }
  }, []);

  if (authToken==undefined) {
    return null;
  }

  return (
    <>
      <div className={styles.outer}>
        <div className={styles.container}>
          {/* Apply container class */}
          <div className={styles.toaste}>
            <ToastContainer />
          </div>
          <h2 className={styles.h2}>Login</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputdiv}>
              <input
                placeholder="Enter Email"
                className={styles.input}
                type="text"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputdiv}>
              <input
                placeholder="Enter Password"
                className={styles.input}
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.btn}>
              <button type="submit" className={styles.button}>
                Login
              </button>
            </div>
            <Link href="/register" scroll={false} className={styles.register}>
              Create new account
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
