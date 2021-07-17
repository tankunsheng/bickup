import React from "react";
import moment from "moment";
import axios from "axios";
import PageLayout from "../components/PageLayout";
import "../css/booking.scoped.scss";
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  TimePicker,
  notification,
} from "antd";
import "../css/index.css";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const IndexPage = ({ location }: any) => {
  const onFinish = (values: any) => {
    const pickupTime = moment(values.pickupTime).format("HH:mm");
    const pickupDate = moment(values.pickupTime).format("MMMM Do YYYY");
    axios
      .post(
        "https://gmz7m1aszi.execute-api.ap-southeast-1.amazonaws.com/dev/jobs",
        {
          ...values,
          pickupTime,
          pickupDate,
        }
      )
      .then((response) => {
        console.log("success", response);
        notification.success({
          message: `You have posted a job`,
          description: "A driver will contact you soon",
          placement: "topRight",
        });
        setTimeout(() => {
          window.location.href = "";
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: `Error`,
          description: "Error =(",
          placement: "topRight",
        });
      });
  };
  const Index = () => {
    const smallFormInputStyle: React.CSSProperties = {
      float: "left",
      minWidth: "10em",
    };

    return (
      <>
        <div style={{ marginBottom: "2em" }}>
          Please enter your job details below and a driver will contact you at
          your Phone Number
        </div>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            label="No. Pax"
            name="numPax"
            rules={[{ required: true }]}
            initialValue={1}
          >
            <InputNumber min={1} max={10} style={smallFormInputStyle} />
          </Form.Item>
          <Form.Item
            label="No. Bikes"
            name="numBikes"
            rules={[{ required: true }]}
            initialValue={1}
          >
            <InputNumber min={1} max={10} style={smallFormInputStyle} />
          </Form.Item>

          <Form.Item
            label="Date"
            name="pickupDate"
            rules={[
              { required: true, message: "Please input your pick up date" },
            ]}
          >
            <DatePicker style={smallFormInputStyle} />
          </Form.Item>

          <Form.Item
            name="pickupTime"
            label="Time"
            rules={[
              { required: true, message: "Please input your pick up time" },
            ]}
          >
            <TimePicker style={smallFormInputStyle} format="HH:mm" />
          </Form.Item>

          <Form.Item
            label="Pick up point"
            name="origin"
            rules={[
              { required: true, message: "Please input your pick up point" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.List
            name="destinations"
            rules={[
              {
                validator: async (_, destinations) => {
                  if (!destinations || destinations.length < 1) {
                    return Promise.reject(
                      new Error("Add at least one drop-off point")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              // <div className="ant-row ant-form-item" style={{ rowGap: "0px" }}>
              <div>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div
                    key={key}
                    // style={{ display: "flex", width:"100%",marginBottom: 8 }}
                    // align="baseline"
                  >
                    <Form.Item
                      // style={{  width:"100%" }}
                      label="Drop-off point(s)"
                      {...restField}
                      name={[name, "destination"]}
                      fieldKey={[fieldKey, "destination"]}
                      rules={[
                        { required: true, message: "Missing drop-off point" },
                      ]}
                    >
                      <Input
                        className="ant-col ant-col-14"
                        placeholder="Drop-off point"
                      />
                    </Form.Item>
                    <div className="ant-row ant-form-item">
                      <MinusCircleOutlined
                        className="ant-col ant-col-3 ant-form-item-label"
                        style={{
                          fontSize: "xx-large",
                          marginRight: "1em",
                          color: "#f32828",
                        }}
                        onClick={() => remove(name)}
                      />

                      <div className="ant-col ant-col-13" />
                    </div>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="ghost"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Drop-off point
                  </Button>

                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </div>
            )}
          </Form.List>

          <Form.Item
            label="Phone Number"
            name="contact_no"
            rules={[
              {
                required: true,
                message: "Please input your contact number",
              },
              {
                validator: (_, value) =>
                  /^\d+$/.test(value)
                    ? Promise.resolve()
                    : Promise.reject(
                        "Mobile number should contain only numbers"
                      ),
              },
              {
                validator: (_, value) =>
                  value.length === 8
                    ? Promise.resolve()
                    : Promise.reject(
                        "Mobile number should be exactly 8 digits long"
                      ),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Booking
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  };
  return <PageLayout content={<Index />} location={location} />;
};

export default IndexPage;
