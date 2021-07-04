import React, { useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import { StaticImage } from "gatsby-plugin-image";
import PageLayout from "../../components/PageLayout";
import { notification, Space } from "antd";
const callback = ({ location }: any) => {
  const CallBack = () => {
    useEffect(() => {
      const setTokenInLocalStorage = function () {
        if (typeof window !== "undefined") {
          let idToken = queryString.parse(window.location.hash).id_token;
          if (typeof idToken === "string") {
            localStorage.setItem("idToken", idToken);
            return idToken;
          }
        }
      };
      const loggedInAcceptJob = async function (
        idToken: string,
        pathAndQs: string
      ) {
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
                "You have accepted the job",
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
      };
      const pathAndQs = queryString.parse(window.location.hash).state;
      const idToken = setTokenInLocalStorage();
      if (!idToken) {
        //error no idtoken in callback
        return;
      }
      if (pathAndQs && typeof pathAndQs === "string") {
        loggedInAcceptJob(idToken, pathAndQs);
      } else {
        //login from non job page, redirect to root
        window.location.href = "/";
      }
    }, []);

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
