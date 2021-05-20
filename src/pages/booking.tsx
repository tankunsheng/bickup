import React, { useEffect } from "react";
import axios from "axios";
import PageLayout from "../components/PageLayout";
import "../css/booking.scoped.scss"
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  TimePicker,
} from "antd";
import "../css/index.css";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const IndexPage = ({ location }: any) => {
  // https://yuyofv3wvd.execute-api.ap-southeast-1.amazonaws.com/dev/job
  useEffect(() => {
    axios
      .post(
        "https://yuyofv3wvd.execute-api.ap-southeast-1.amazonaws.com/dev/job",
        {
          clientNumber: "clientNumber10",
        }
      )
      .then((response) => {
        console.log(response);
      });
  });
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };
  const Index = () => {
    const smallFormInputStyle: React.CSSProperties = {
      float: "left",
      minWidth: "10em",
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        onFinish={onFinish}
        // initialValues={{ size: componentSize }}
        // onValuesChange={onFormLayoutChange}
        size="large"
      >
        {/* <Row>
          <Col span={12}> */}
        <Form.Item label="No. Pax" >
          <InputNumber min={1} max={10} style={smallFormInputStyle} />
        </Form.Item>
        <Form.Item label="No. Bikes">
          <InputNumber min={1} max={10} style={smallFormInputStyle} />
        </Form.Item>

        <Form.Item label="Date">
          <DatePicker style={smallFormInputStyle} />
        </Form.Item>

        <Form.Item name="time-picker" label="Time">
          <TimePicker style={smallFormInputStyle} />
        </Form.Item>

        <Form.Item 
          label="Pick up point"
          name="origin"
          rules={[
            { required: true, message: "Please input your pick up point" },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.List 
          name="destinations"
          rules={[
            {
              validator: async (_, destinations) => {
                if (!destinations || destinations.length < 1) {
                  return Promise.reject(new Error("Add at least one drop-off point"));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                // <Form.Item
                //   {...(index === 0
                //     ? formItemLayout
                //     : formItemLayoutWithOutLabel)}
                //   label={index === 0 ? "Drop-off point(s)" : ""}
                //   required={false}
                //   key={field.key}
                // >
                  <Form.Item
                   label="Drop-off point(s)"
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message:
                          "Please enter a drop-off point or remove this field",
                      },
                    ]}
                    // noStyle
                  >
                    <Input className="ant-col ant-col-14"
                      placeholder="Drop-off point"
                     
                    />
                  {/* </Form.Item> */}
                  {fields.length > 0 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                   
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
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
            </>
          )}
        </Form.List>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[
            {
              required: true,
              message: "Please input your phone number",
            },
            {
              validator: (_, value) =>
                /^\d+$/.test(value)
                  ? Promise.resolve()
                  : Promise.reject("Mobile number should contain only numbers"),
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
    );
  };
  return <PageLayout content={<Index />} location={location} />;
};

export default IndexPage;
