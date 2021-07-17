// https://stackoverflow.com/questions/55756994/how-to-create-dynamic-route-in-gatsby
// https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/#creating-client-only-routes
import React, { useEffect, useState } from "react";
import axios from "axios";
import PageLayout from "../../components/PageLayout";
import { Space } from "antd";
import "../../css/index.css";

import { getTokenDetails } from "../../lib/helper";
const jobPage = ({ params, location }: any) => {
  const Job = () => {
    let defaultJob: {
      origin: string;
      contact_no: string;
      numBikes: number;
      numPax: number;
      pickupDate: string;
      pickupTime: string;
      status: string;
      driver?: string;
      destinations: Array<{ destination: string }>;
    } = {
      origin: "",
      contact_no: "",
      numBikes: 0,
      numPax: 0,
      pickupDate: "",
      pickupTime: "",
      status: "",
      destinations: [],
    };
    const [job, setJob] = useState(defaultJob);
    useEffect(() => {
      axios
        .get(
          `https://gmz7m1aszi.execute-api.ap-southeast-1.amazonaws.com/dev${
            location.pathname + location.search
          }`
        )
        .then((res) => {
          console.log(res);
          const job = res.data.job;
          setJob(job);
        });
    }, []);

    const loginFlow = (stateString: string) => {
      console.log(`statestring is ${stateString}`);
      if (typeof window !== "undefined") {
        // console.log(`https://dev-bickup.auth.ap-southeast-1.amazoncognito.com/login?client_id=u0ktona8tfa865dom9oh63lfi&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&state=${stateString}&redirect_uri=${location.origin}/login/callback/`)
        window.location.href = `https://dev-bickup.auth.ap-southeast-1.amazoncognito.com/login?client_id=u0ktona8tfa865dom9oh63lfi&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&state=${stateString}&redirect_uri=${location.origin}/login/callback/`;
      }
    };
    const isAcceptedByCurrDriver = () => {
      if (typeof window !== "undefined") {
        const idToken = localStorage.getItem("idToken");
        if (idToken) {
          const decoded = getTokenDetails(idToken);
          return decoded.email === job.driver;
        }
      }
      return false;
    };
    const acceptJob = () => {
      if (typeof window === "undefined") {
        return
      }
      const idToken = localStorage.getItem("idToken");
      const pathAndQs = location.pathname + location.search;
      if (!idToken) {
        console.log("no id token");
        //prompt login again?
        loginFlow(pathAndQs);
      } else {
        axios
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
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            //check if token expired error and prompt login again?
            loginFlow(pathAndQs);
          });
      }
    };
    return (
      <div>
        <Space
          size="large"
          direction="vertical"
          style={{ width: "100%", textAlign: "center" }}
        >
          {/* todo only show contact to accepted driver */}
          {isAcceptedByCurrDriver() && (
            <span>Contact No. : {job.contact_no}</span>
          )}
          <span>Pick-up Point: {job.origin}</span>
          Destinations:
          {job.destinations &&
            job.destinations.map((dest, index) => {
              return <b key={dest.destination + index}>{dest.destination} </b>;
            })}
          <span>No. Bikes:{job.numBikes}</span>
          <span>No. Passengers: {job.numPax}</span>
          <span>Pick-up Date: {job.pickupDate}</span>
          <span>Pick-up Time: {job.pickupTime}</span>
          <span>Status: {job.status}</span>
        </Space>
         
        <div className="flex items-center justify-center mt-4">
          {job.status !== "accepted" ? (
            <a onClick={acceptJob}>Accept</a>
          ) : (
            <h2>
              This job has already been accepted by{" "}
              {isAcceptedByCurrDriver() ? "you" : <u>{job.driver}</u>}
            </h2>
          )}
        </div>
      </div>
    );
  };
  return <PageLayout content={<Job />} location={location} />;
};

export default jobPage;
