import React from "react";
import { StaticImage } from "gatsby-plugin-image";
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
             Bicycle Pick up
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
          <div className="flex justify-center mt-12">
            <StaticImage src="../images/icon.png" alt="A dinosaur" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-48 w-48"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };
  return <PageLayout content={<Index />} />;
};

export default IndexPage;
