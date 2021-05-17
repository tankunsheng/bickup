import React from "react";
import Header from "./Header";
export default ({ content, location }: any) => {
  console.log(location);
  return (
    <>
      <main className="dark:bg-gray-800 bg-white relative overflow-hidden h-screen">
        <Header location={location} />
        {content}
      </main>
    </>
  );
};
