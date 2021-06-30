import React, { useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import { StaticImage } from "gatsby-plugin-image";
import PageLayout from "../../components/PageLayout";
import { Button, Space } from "antd";
const callback = ({ location }: any) => {
  const CallBack = () => {
    if (typeof window !== "undefined") {
      let idToken = queryString.parse(window.location.hash).id_token;
      console.log(idToken);
      if (typeof idToken === "string") {
        //user just signed in and the callback url is hit
        //save token into localstorage and send api request to accept job with token in header
        localStorage.setItem("idToken", idToken);

        // axios.patch()
      }else{
        //idtoken is missing, error and redirect
      }
    }

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
      </div>
    );
  };
  return <PageLayout content={<CallBack />} location={location} />;
};

export default callback;
