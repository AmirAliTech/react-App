import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import SideComponent from "./SideComponent";

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    email: "",
    message: "",
    nfile: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("nfile", formData.nfile);

      const response = await fetch("http://localhost:3001/enterdata", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log("Data saved successfully");
        setFormData({
          name: "",
          age: 0,
          email: "",
          message: "",
          nfile: null,
        });
        const expirationTime = 60 * 10000;
        setTimeout(() => {
          localStorage.removeItem("token");
        }, expirationTime);
        navigate("/find");
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <>
      {localStorage.getItem("token") ? (
        <>
          <SideComponent />
          <div className="form">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label htmlFor="name">Name:</label>
              <br />
              <input
                type="text"
                id="name"
                name="name"
                onChange={handleChange}
                value={formData.name}
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
                value={formData.age}
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
                value={formData.email}
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
                value={formData.message}
              ></textarea>
              <br />
              <input type="file" name="nfile" onChange={handleChange} />
              <input type="submit" className="btn" />
            </form>
          </div>
        </>
      ) : (
        <p>401 forbidden</p>
      )}
    </>
  );
};

export default MyForm;
