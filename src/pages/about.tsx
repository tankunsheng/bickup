import React from "react";
import PageLayout from "../components/PageLayout";

const IndexPage = ({ location }: any) => {
  const About = () => {
    return <div>ABOUT PAGE</div>;
  };
  return <PageLayout content={<About />} location={location} />;
};

export default IndexPage;
