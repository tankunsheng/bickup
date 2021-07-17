import React, { useEffect } from "react";
import { StaticImage } from "gatsby-plugin-image";
import PageLayout from "../components/PageLayout";
import { Button, Space } from "antd";
import "../css/index.css";
const IndexPage = ({ location }: any) => {
  useEffect(() => {});
  const Index = () => {
    return (
      <div>
        <div>
          <Space direction="vertical">
            <StaticImage
              src="../images/bickup.png"
              alt="bickup"
              width={512}
              className="mb-12"
            />
          </Space>
        </div>
        <h1>Bickup</h1>
        <h2 className="font-light max-w-2xl mx-auto w-full text-xl dark:text-white text-gray-500 text-center py-8">
         Don't feel like making the returning bicycle ride back to home? Use our round-the-clock bicycle transportation service!
        </h2>
        <div className="flex items-center justify-center mt-4">
          <Button
            size="large"
            onClick={() => (window.location.href = "/booking")}
          >
            Book Now
          </Button>
        </div>
      </div>
    );
  };
  return <PageLayout content={<Index />} location={location} />;
};

export default IndexPage;
