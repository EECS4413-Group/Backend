import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./home";
import SignUp from "./signup";
import Login from "./login";
import CreateListing from "./create_listing";
import ViewListings from "./view_listings";
import ViewListing from "./view_listing";
import Wallet from "./wallet";
import ViewOrders from "./view_orders";
import ViewOrder from "./view_order";

const Router = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/sign_up" element={<SignUp />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/listings/new" element={<CreateListing />} />
      <Route exact path="/listings" element={<ViewListings />} />
      <Route path="/listing/:id" element={<ViewListing />} />
      <Route exact path="/wallet" element={<Wallet />} />
      <Route exact path="/orders" element={<ViewOrders />} />
      <Route path="/orders/:id" element={<ViewOrder />} />
    </Routes>
  );
};

export default Router;
