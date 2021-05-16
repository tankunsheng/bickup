import React from "react";
import PageLayout from "../components/PageLayout";

const IndexPage = () => {
  const About = () => {
    return <div>ABOUT PAGE</div>;
  };
  return <PageLayout content={<About />} />;
};

export default IndexPage;
