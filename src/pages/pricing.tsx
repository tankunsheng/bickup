import React from "react";
import PageLayout from "../components/PageLayout";
import { Space, Descriptions } from "antd";
const IndexPage = ({ location }: any) => {
  const About = () => {
    return (
      <>
        <h2>Charges</h2>
        <p>Charges are determined by distance travelled and time of day</p>
        <Space size="large" direction="vertical"  style={{ width: "75%", textAlign: "center" }}>
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="Rates for travelled distance">
              <Space direction="vertical">
                {"Distance < 5km = $30"}
                {"5km < Distance < 10km = $40"}
                {"Distance > 15km = $60"}
              </Space>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="Rates at different time of the day">
              <Space direction="vertical">Extra charges apply after 10pm</Space>
            </Descriptions.Item>
          </Descriptions>
        </Space>
        {/* <h2>Calculator</h2> */}
      </>
    );
  };
  return <PageLayout content={<About />} location={location} />;
};

export default IndexPage;
