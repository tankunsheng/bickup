import React from "react";
import Header from "./Header";
export default ({ content, location }: any) => {
  console.log(location);
  return (
    <>
      <main className="dark:bg-gray-800 bg-white relative overflow-hidden h-screen container mx-auto px-6 ">
        <Header location={location} />
        {content}
      </main>
    </>
  );
};
