import React from "react";
import { Router, Link } from "@reach/router";
import Home from "../components/Home";
import About from "../components/About";
import Header from "../components/Header";

// markup
const IndexPage = () => {
  return (
    <main className="dark:bg-gray-800 bg-white relative overflow-hidden h-screen">
      <Header />
      <Router >
        <Home path="/" />
        <About path="/about" />
      </Router>
    </main>
  );
};

export default IndexPage;
