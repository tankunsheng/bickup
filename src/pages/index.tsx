import React, { useEffect } from "react";
import axios from "axios";
import { StaticImage } from "gatsby-plugin-image";
import PageLayout from "../components/PageLayout";

const IndexPage = ({ location }: any) => {
  // https://yuyofv3wvd.execute-api.ap-southeast-1.amazonaws.com/dev/job
  useEffect(() => {
    axios.post('https://yuyofv3wvd.execute-api.ap-southeast-1.amazonaws.com/dev/job', {
      "clientNumber": "clientNumber10",
      "bicycleModel": "bicycleModel",
      "srcLocation": "srcLocation",
      "destLocation": "destLocation"
    }).then((response) => {
      console.log(response);
    });
    // axios(
    //   "https://yuyofv3wvd.execute-api.ap-southeast-1.amazonaws.com/dev/job",
    //   {
    //     method: "POST",
    //   }
    // ).then((response) => {

  });
  const Index = () => {
    return (
      <div className="flex flex-col justify-between items-center relative py-8">
        <div className="flex justify-center mt-12">
          <StaticImage
            src="../images/icon.png"
            alt="A dinosaur"
            width={256}
            className="mb-12"
          />
        </div>
        <h1 className="font-light w-full uppercase text-center text-4xl sm:text-5xl dark:text-white text-gray-800">
          Bick-up
        </h1>
        <h2 className="font-light max-w-2xl mx-auto w-full text-xl dark:text-white text-gray-500 text-center py-8">
          Our fleet of drivers provide bike transportation. Book now!
        </h2>
        <div className="flex items-center justify-center mt-4">
          <a
            href="#"
            className="uppercase py-2 px-4 bg-gray-800 border-2 border-transparent text-white text-md mr-4 hover:bg-gray-900"
          >
            Book Now
          </a>
        </div>
      </div>
    );
  };
  return <PageLayout content={<Index />} location={location} />;
};

export default IndexPage;
