import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateDataComponent = () => {
  const { uid } = useParams();
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:3001/findOne/${uid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response.ok) {
          const data = await response.json();

          setName(data.name);
          setAge(data.age);
          setEmail(data.email);
          setMessage(data.message);
          setFile(data.nfile);
        } else {
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [uid]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("age", age);
      formData.append("email", email);
      formData.append("message", message);
      if (file) {
        formData.append("nfile", file);
      }

      const response = await fetch(`http://localhost:3001/updatedata/${uid}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setUpdateStatus("Data updated successfully");
        const token = localStorage.getItem("token");
        const expirationTime = 60 * 10000;
        setTimeout(() => {
          localStorage.removeItem("token");
        }, expirationTime);
        navigate("/find");
      } else if (response.status === 404) {
        setUpdateStatus("No data found");
      } else {
        setUpdateStatus("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error.message);
      setUpdateStatus("Internal Server Error");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case "name":
        setName(value);
        break;
      case "age":
        setAge(Number(value));
        break;
      case "email":
        setEmail(value);
        break;
      case "message":
        setMessage(value);
        break;
      default:
        break;
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <>
      {localStorage.getItem("token") ? (
        <div className="form1">
          <br />
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={age}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Message:
            <textarea
              cols="30"
              rows="10"
              name="message"
              value={message}
              onChange={handleChange}
            ></textarea>
          </label>
          <br />
          <div className="d-flex justify-content-center align-items-center">
            <input
              type="file"
              name="nfile"
              onChange={handleFileChange}
              className="updatefile"
            />
          </div>
          <br />
          <button onClick={handleUpdate} className="btn">
            Update Data
          </button>
          {updateStatus && <p>{updateStatus}</p>}
        </div>
      ) : (
        <p>401 forbidden</p>
      )}
    </>
  );
};

export default UpdateDataComponent;
