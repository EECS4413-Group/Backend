import React from "react";
import { Routes, Route } from "react-router-dom";

import SignUp from "./signup";
import Browse from "./browse";
const Router = () => {
  return (
    <Routes>
      <Route exact path="/browse" element={<Browse />} />
      <Route exact path="/sign_up" element={<SignUp />} />
    </Routes>
  );
};

export default Router;