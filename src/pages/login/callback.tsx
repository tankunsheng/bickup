import React, { useEffect } from "react";
import axios from "axios";
import { StaticImage } from "gatsby-plugin-image";
import PageLayout from "../../components/PageLayout";
import { Button, Space } from "antd";
const callback = ({ location }: any) => {
  const CallBack = () => {
    const url = window.location.href;
    return (
      <div>
        <Space direction="vertical">
          <StaticImage
            src="../images/icon.png"
            alt="A dinosaur"
            width={256}
            className="mb-12"
          />
        
        </Space>
        <p>{url}</p>
      </div>
    );
  };
  return <PageLayout content={<CallBack />} location={location} />;
};

export default callback;
