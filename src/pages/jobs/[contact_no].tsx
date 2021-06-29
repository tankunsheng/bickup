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
    const [job, setJob] = useState({
      origin: "",
      contact_no: "",
      numBikes: "",
      numPax: "",
    });
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
    },[]);
    return (
      <div>
        Pick-up Point: {job.origin}
        No. Bikes:{job.numBikes}
        No. Passengers: {job.numPax}
        Contact No. : {job.contact_no}
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
