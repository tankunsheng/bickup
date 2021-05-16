import React from "react";
import Header from "./Header";
export default ({ content }: any) => {
  return (
    <>
      <main className="dark:bg-gray-800 bg-white relative overflow-hidden h-screen">
        <Header />
        {content}
      </main>
    </>
  );
};
