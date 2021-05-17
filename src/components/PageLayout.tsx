import React from "react";
import Header from "./Header";
import { Space } from "antd";
export default ({ content, location }: any) => {
  return (
    <div>
      <Space
        size="large"
        direction="vertical"
        style={{ width: "100%", textAlign: "center" }}
      >
        <Header location={location} />
        <div style={{ padding: "0 2em 0 2em" }}>{content}</div>
      </Space>
    </div>
  );
};
