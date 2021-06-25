import axios from "axios";
// import { DynamoDB } from "@aws-sdk/client-dynamodb";
// const client = new DynamoDB({
//   region: "ap-southeast-1",
// });
const createJob = async function (event: any, context: any) {
  console.log("create job");
  // var params = {
  //   Item: {
  //     contact_no: {
  //       S: "123456",
  //     },
  //     created_at: {
  //       S: "123456",
  //     },
  //   },
  //   TableName: "dev-bickup-jobs-table",
  // };
  // try {
  //   let res = await new Promise((resolve, reject) => {
  //     client.putItem(params, function (err: any, data: any) {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(data);
  //       }
  //     });
  //   });
  //   console.log("Success - put");
  //   console.log(res);
  // } catch (err) {
  //   console.log("Error", err);
  // }
  console.log;
};

// telegram restapis reference: https://core.telegram.org/bots/api#making-requests
// simple messages can be sent in the format of POST https://api.telegram.org/bot1891683701:AAFRELCirvrwZldZ0E-NaWo-4hHx-IS9OJ4/sendMessage
//   {
//     "chat_id": "-334215881",
//     "text": "test"
//   }
const handleJobStream = async function (event: any, context: any) {
  console.log(event);
  console.log(event.Records[0].dynamodb);
  console.log(context);
  console.log("db stream job");

  const testToken = "1891683701:AAFRELCirvrwZldZ0E-NaWo-4hHx-IS9OJ4";
  const testChatId = "-334215881";
  const response = await axios.post(
    `https://api.telegram.org/bot${testToken}/sendMessage`,
    {
      chat_id: testChatId,
      text: `${event.Records[0].eventName} event. New data = ${JSON.stringify(
        event.Records[0].dynamodb.NewImage
      )}`,
    }
  );
  console.log(response);
};
export { createJob, handleJobStream };
