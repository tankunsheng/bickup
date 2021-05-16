import React from "react";

import PageLayout from "../components/PageLayout";

const IndexPage = () => {
  const Index = () => {
    return (
      <div className="bg-white dark:bg-gray-800 flex relative z-20 items-center">
        <div className="container mx-auto px-6 flex flex-col justify-between items-center relative py-8">
          <div className="flex flex-col">
            <h1 className="font-light w-full uppercase text-center text-4xl sm:text-5xl dark:text-white text-gray-800">
              Bick-up
            </h1>
            <h2 className="font-light max-w-2xl mx-auto w-full text-xl dark:text-white text-gray-500 text-center py-8">
              Next.js gives you the best developer experience with all the
              features you need for production: hybrid static &amp; server
              rendering, TypeScript support, smart bundling, route pre-fetching,
              and more. No config needed.
            </h2>
            <div className="flex items-center justify-center mt-4">
              <a
                href="#"
                className="uppercase py-2 px-4 bg-gray-800 border-2 border-transparent text-white text-md mr-4 hover:bg-gray-900"
              >
                Get started
              </a>
            </div>
          </div>
          <div className="block w-full mx-auto mt-6 md:mt-0 relative">
            <img
              src="/images/object/12.svg"
              className="max-w-xs md:max-w-2xl m-auto"
            />
          </div>
        </div>
      </div>
    );
  };
  return ( <PageLayout content={<Index />} />);
};

export default IndexPage;
