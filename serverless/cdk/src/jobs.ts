import axios from "axios";
import * as AWS from "aws-sdk";
const client = new AWS.DynamoDB.DocumentClient({
  region: "ap-southeast-1",
});
const createJob = async function (event: any, context: any) {
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
  const contact_no = "12345678";
  const params = {
    Item: {
      contact_no: contact_no,
      created_at: localISOTime,
    },
    TableName: "dev-bickup-jobs-table",
  };
  try {
    let res = await new Promise((resolve, reject) => {
      client.put(params, function (err: any, data: any) {
        if (err) {
          reject(err);
        } else {
          console.log(`resolved data is ${data}`);
          resolve(data);
        }
      });
    });
    console.log("Success - put");
    console.log(res);
    return {
      body: JSON.stringify({
        statusCode: 200,
        message: `Created Job for contact_no ${contact_no} at ${localISOTime}`,
      }),
    };
  } catch (err) {
    console.log("Error", err);
    return {
      body: JSON.stringify({
        statusCode: 500,
        message: err,
      }),
    };
  }
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
