import React, { useEffect } from "react";
import axios from "axios";
import { StaticImage } from "gatsby-plugin-image";
import PageLayout from "../components/PageLayout";
import { Button, Space } from "antd";
import "../css/index.css";
const jobPage = ({ location }: any) => {
  // https://yuyofv3wvd.execute-api.ap-southeast-1.amazonaws.com/dev/job

  const Job = () => {
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
        
        <div className="flex items-center justify-center mt-4">
          <a href="https://dev-bickup.auth.ap-southeast-1.amazoncognito.com/login?client_id=u0ktona8tfa865dom9oh63lfi&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:8000/login/callback">Accept</a>
        </div>
      </div>
    );
  };
  return <PageLayout content={<Job />} location={location} />;
};

export default jobPage;
