import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../src/App.css";
import MyComponent from "./Components/MyComponent";
import MyForm from "./Components/MyForm";
import UpdateDataComponent from "./Components/UpdateDataComponent";
import SignInComponent from "./Components/SignInComponent";
import PageNot from "./Components/PageNot";
import BlogPage from "./Components/BlogPage";

const App = () => (
  <div className="app">
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<MyForm />}></Route>
        <Route exact path="/find" element={<MyComponent />}></Route>
        <Route
          exact
          path="/update/:uid"
          element={<UpdateDataComponent />}
        ></Route>
        <Route exact path="/signin" element={<SignInComponent />}></Route>
        <Route exact path="*" element={<PageNot />}></Route>
        <Route exact path="blogpage" element={<BlogPage />}></Route>
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
