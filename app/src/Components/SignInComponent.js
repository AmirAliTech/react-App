import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import SideComponent from "./SideComponent";

const SignInComponent = () => {
  const [signinData, setSigninData] = useState({
    name: "",
    age: 0,
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSigninData({
      ...signinData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3001/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signinData),
      });

      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token;
        if (token) {
          console.log(token);
          localStorage.setItem("token", token);
          const authtoken = localStorage.getItem("token");
          console.log(authtoken);

          const authHeaders = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

          const getDataResponse = await fetch(`http://localhost:3001/gettoken`, {
            method: "GET",
            headers: authHeaders,
          });

          if (getDataResponse.ok) {
            const dataResponse = await getDataResponse.json();
            console.log("Data from server:", dataResponse);
            const expirationTime = 60 * 10000;
            const timerId = setTimeout(() => {
              localStorage.removeItem("token");
            }, expirationTime);
            navigate("/find");
          } else {
            console.error("Failed to get data");
          }
        }
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideComponent />
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={signinData.name}
            required
          />
          <br />
          <label htmlFor="age">Age:</label>
          <br />
          <input
            type="number"
            id="age"
            name="age"
            onChange={handleChange}
            value={signinData.age}
            required
          />
          <br />
          <label htmlFor="email">Email:</label>
          <br />
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={signinData.email}
            required
          />
          <br />
          <label htmlFor="message">Message:</label>
          <br />
          <textarea
            cols="30"
            rows="10"
            id="message"
            name="message"
            onChange={handleChange}
            value={signinData.message}
          ></textarea>
          <br />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default SignInComponent;
