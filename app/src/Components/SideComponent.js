import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../App.css";

const SideComponent = () => {
  return (
    <div className="aside">
      <div
        className=""
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <i className="fa-solid fa-bars burger cursorpointer"></i>
      </div>

      <div
        className="offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabindex="-1"
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
            
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body flex-column d-flex w-50 ">
          <Link to="/">Add Data</Link>
          <Link to="/find">See and Modify Data</Link>
        </div>
      </div>
    </div>
  );
};

export default SideComponent;
