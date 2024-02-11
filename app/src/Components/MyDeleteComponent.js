import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const MyDeleteComponent = ({ itemId, onUpdate }) => {
  const [deleteStatus, setDeleteStatus] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!itemId) {
      console.error("itemId is undefined");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/itemremove/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        setDeleteStatus("Data deleted successfully");
        onUpdate();
        navigate("/find");
      } else if (response.status === 404) {
        setDeleteStatus("No data found");
      } else {
        setDeleteStatus("Failed to delete data");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setDeleteStatus("Internal Server Error");
    }
  };

  return (
    <div>
      <button onClick={handleDelete} className="updatebtn">
        Delete Data
      </button>
      {deleteStatus && <p>{deleteStatus}</p>}
    </div>
  );
};

export default MyDeleteComponent;
