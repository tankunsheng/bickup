import axios from "axios";
import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { handleResponse } from "./lib/helper";

const client = new AWS.DynamoDB.DocumentClient({
  region: "ap-southeast-1",
});
class BetterDate extends Date {
  constructor() {
    super();
  }
  addHours(hoursToAdd: number) {
    this.setTime(this.getTime() + hoursToAdd * 60 * 60 * 1000);
  }
}
const createJob = async function (event: any, context: any) {
  const reqBody = JSON.parse(event.body);
  const contact_no = reqBody.contact_no;
  const origin = reqBody.origin;
  const numBikes = reqBody.numBikes;
  const numPax = reqBody.numPax;

  // const destLocation = reqBody.destinations;
  if (!process.env.JOBS_TABLE) {
    console.log("Jobs table name not specified");
    return;
  }
  const now = new BetterDate();
  now.addHours(8);

  // const contact_no = "12345678";
  const params = {
    Item: {
      contact_no: contact_no,
      created_at: now.toISOString(),
      id: uuid(),
      //origin
      origin,

      //destinations
      //datetime pickup
      //no.bikes
      numBikes,
      //no.pax
      numPax,
    },
    TableName: process.env.JOBS_TABLE,
  };
  try {
    await new Promise((resolve, reject) => {
      client.put(params, function (err: any, data: any) {
        if (err) {
          reject(err);
        } else {
          console.log(`resolved data is ${data}`);
          resolve(data);
        }
      });
    });
    // return {
    //   body: JSON.stringify({
    //     statusCode: 200,
    //     message: `Created Job for contact_no ${contact_no} at ${now.toISOString()}`,
    //   }),
    // };
    return handleResponse(event, {
      body: JSON.stringify({
        statusCode: 200,
        message: `Created Job for contact_no ${contact_no} at ${now.toISOString()}`,
      }),
    });
  } catch (err) {
    console.log("Error", err);
    return handleResponse(event,{
      body: JSON.stringify({
        statusCode: 500,
        message: err,
      }),
    })
  }
};

// telegram restapis reference: https://core.telegram.org/bots/api#making-requests
// simple messages can be sent in the format of POST https://api.telegram.org/bot1891683701:AAFRELCirvrwZldZ0E-NaWo-4hHx-IS9OJ4/sendMessage
//   {
//     "chat_id": "-334215881",
//     "text": "test"
//   }
const handleJobStream = async function (event: any, context: any) {
  var secretsmanager = new AWS.SecretsManager({
    region: "ap-southeast-1",
  });
  // console.log(event);
  // console.log(event.Records[0].dynamodb);
  // console.log(context);
  // console.log("db stream job");
  const decryptedSecret: any = await new Promise((resolve, reject) => {
    secretsmanager.getSecretValue(
      {
        SecretId: "dev/bickup/bot/token",
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
  if (decryptedSecret) {
    const botToken = JSON.parse(decryptedSecret.SecretString)[
      "dev-bickup-bot-token"
    ];
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: `${event.Records[0].eventName} event. New data = ${JSON.stringify(
          event.Records[0].dynamodb.NewImage
        )}`,
      }
    );
    console.log(response);
    return {
      body: JSON.stringify({
        statusCode: 200,
      }),
    };
  } else {
    console.log("decryptedSecret is invalid");
    return {
      body: JSON.stringify({
        statusCode: 500,
      }),
    };
  }
};
export { createJob, handleJobStream };
