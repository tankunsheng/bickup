import React, { useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import { StaticImage } from "gatsby-plugin-image";
import PageLayout from "../../components/PageLayout";
import { notification, Space } from "antd";
const callback = ({ location }: any) => {
  const CallBack = async () => {
    if (typeof window !== "undefined") {
      let idToken = queryString.parse(window.location.hash).id_token;
      console.log(idToken);
      if (typeof idToken === "string") {
        //user just signed in and the callback url is hit
        //save token into localstorage and send api request to accept job with token in header
        localStorage.setItem("idToken", idToken);
        const pathAndQs = queryString.parse(window.location.hash).state;
        console.log(pathAndQs);
        await axios
          .patch(
            `https://gmz7m1aszi.execute-api.ap-southeast-1.amazonaws.com/dev${pathAndQs}`,
            {},
            {
              headers: {
                Authorizer: idToken,
              },
            }
          )
          .then((res) => {
            console.log("response from patch");
            console.log(res);
            notification.success({
              message: `Notification `,
              description:
                "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
              placement: "topRight",
            });
          })
          .catch((err) => {
            notification.error({
              message: `Notification `,
              description: err.response.data.message,
              placement: "topRight",
            });
            console.log(err.response);
            //check if token expired error and prompt login again?
            // loginFlow(pathAndQs);
          });
        setTimeout(function () {
          window.location.href = `${pathAndQs}`;
        }, 5000);
      } else {
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
