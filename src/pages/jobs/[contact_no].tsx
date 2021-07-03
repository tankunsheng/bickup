// https://stackoverflow.com/questions/55756994/how-to-create-dynamic-route-in-gatsby
// https://www.gatsbyjs.com/docs/reference/routing/file-system-route-api/#creating-client-only-routes
import React, { useEffect, useState } from "react";
import { StaticImage } from "gatsby-plugin-image";
import axios from "axios";
import queryString from "query-string";
import PageLayout from "../../components/PageLayout";
import { Space } from "antd";
import "../../css/index.css";
const jobPage = ({ params, location }: any) => {
  const Job = () => {
    let defaultJob: {
      origin: string;
      contact_no: string;
      numBikes: number;
      numPax: number;
      pickupDate: string;
      pickupTime: string;
      destinations: Array<{ destination: string }>;
    } = {
      origin: "",
      contact_no: "",
      numBikes: 0,
      numPax: 0,
      pickupDate: "",
      pickupTime: "",
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
      console.log(`statestring is ${stateString}`)
      if (typeof window !== "undefined") {
        window.location.href = `https://dev-bickup.auth.ap-southeast-1.amazoncognito.com/login?client_id=u0ktona8tfa865dom9oh63lfi&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&state=${stateString}&redirect_uri=http://localhost:8000/login/callback/`;
      }
    };
    const acceptJob = () => {
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
          .catch((err) => {
            console.log(err);
            //check if token expired error and prompt login again?
            loginFlow(pathAndQs);
          });
      }
    };
    return (
      <div>
        Pick-up Point: {job.origin}
        No. Bikes:{job.numBikes}
        No. Passengers: {job.numPax}
        Pick-up Date: {job.pickupDate}
        Pick-up Time: {job.pickupTime}
        Destinations:
        {job.destinations.map((dest, index) => {
          return <b key={dest.destination + index}>{dest.destination} </b>;
        })}
        Contact No. : {job.contact_no}
        <div className="flex items-center justify-center mt-4">
          {/* add query string params state to pass variables through to callback */}
          <a onClick={acceptJob}>
          {/* <a href="https://dev-bickup.auth.ap-southeast-1.amazoncognito.com/login?client_id=u0ktona8tfa865dom9oh63lfi&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:8000/login/callback/"> */}
            Accept
          </a>
        </div>
      </div>
    );
  };
  return <PageLayout content={<Job />} location={location} />;
};

export default jobPage;
