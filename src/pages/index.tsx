import React, { useEffect } from "react";
import axios from "axios";
import { StaticImage } from "gatsby-plugin-image";
import PageLayout from "../components/PageLayout";
import { Button, DatePicker, Space } from "antd";
import "../css/index.css";
const IndexPage = ({ location }: any) => {
  // https://yuyofv3wvd.execute-api.ap-southeast-1.amazonaws.com/dev/job
  useEffect(() => {
  
  });
  const Index = () => {
    return (
      <div>
        <div>
          <Space direction="vertical">
            <StaticImage
              src="../images/icon.png"
              alt="A dinosaur"
              width={256}
              className="mb-12"
            />
          </Space>
        </div>
        <h1>Bick-up</h1>
        <h2 className="font-light max-w-2xl mx-auto w-full text-xl dark:text-white text-gray-500 text-center py-8">
          Our fleet of drivers provide bike transportation. Book now!
        </h2>
        <div className="flex items-center justify-center mt-4">
          <Button size="large" onClick={()=>window.location.href="/booking"}>Book Now</Button>
        </div>
      </div>
    );
  };
  return <PageLayout content={<Index />} location={location} />;
};

export default IndexPage;
