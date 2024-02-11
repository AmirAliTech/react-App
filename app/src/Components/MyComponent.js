import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import MyDeleteComponent from "./MyDeleteComponent";
import SideComponent from "./SideComponent";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token not found");
        }
        const response = await fetch("http://localhost:3001/findAll", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error:", error.message);
        setError("Internal Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldUpdate]); 

  const handleUpdate = () => {
    setShouldUpdate(!shouldUpdate);
  };

  return (
    <>
      {localStorage.getItem("token") ? (
        <>
          <SideComponent />
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <ul>
                {data.map((item) => (
                  <li key={item._id} className="list">
                    <p>
                      <strong>Name:</strong> {item.name}, <strong>Age:</strong>
                      {item.age}, <strong>Email:</strong> {item.email},<br/>
                      <strong>Message:</strong> <br/> <div dangerouslySetInnerHTML={{ __html: item.message }}></div>,
                      <strong>Date:</strong> {item.date}
                    </p>
                    <img
                      src={`http://localhost:3001/${item.nfile}`}
                      alt="img"
                      className="cimage"
                    />
                    <div className="updateDelete">
                      <MyDeleteComponent
                        itemId={item._id}
                        onUpdate={handleUpdate} 
                      />
                      <Link
                        to={`/update/${item._id}`}
                        className="updatebtn1"
                      >
                        Update
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <p>401 forbidden</p>
      )}
    </>
  );
};

export default MyComponent;
