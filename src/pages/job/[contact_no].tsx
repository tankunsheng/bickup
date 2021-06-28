// https://stackoverflow.com/questions/55756994/how-to-create-dynamic-route-in-gatsby
// https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/#creating-client-only-routes
import React, { useEffect } from "react";
import { StaticImage } from "gatsby-plugin-image";
import axios from "axios";
import PageLayout from "../../components/PageLayout";
import { Space } from "antd";
import "../../css/index.css";
const jobPage = ({ params, location }: any) => {
  const Job = () => {
    const contact_no = params.contact_no;
    console.log(contact_no);
    console.log(location.search)
    
    useEffect(()=>{
        
    })
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
          <a href="https://dev-bickup.auth.ap-southeast-1.amazoncognito.com/login?client_id=u0ktona8tfa865dom9oh63lfi&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:8000/login/callback">
            Accept
          </a>
        </div>
      </div>
    );
  };
  return <PageLayout content={<Job />} location={location} />;
};

export default jobPage;
