import React from "react";
import PageLayout from "../components/PageLayout";
import { Space, Descriptions } from "antd";
const IndexPage = ({ location }: any) => {
  const About = () => {
    return (
      <>
        <h2>Pricing</h2>
        <Descriptions layout="vertical" bordered>
          <Descriptions.Item label="Distance">
            <Space direction="vertical">
              {"Distance < 5km = $30"}
              {"5km < Distance < 10km = $40"}
              {"Distance > 15km = $60"}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label="Hour">
            <Space direction="vertical">Extra charges apply 10pm</Space>
          </Descriptions.Item>
        </Descriptions>
        <h2>Calculator</h2>
      </>
    );
  };
  return <PageLayout content={<About />} location={location} />;
};

export default IndexPage;
