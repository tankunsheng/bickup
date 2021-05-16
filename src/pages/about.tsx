import React from "react";
import Header from "../components/Header";

// markup
const IndexPage = () => {
  return (
    <main className="dark:bg-gray-800 bg-white relative overflow-hidden h-screen">
      <Header />
      <div className="bg-white dark:bg-gray-800 flex relative z-20 items-center">
        about
      </div>
    </main>
  );
};

export default IndexPage;
