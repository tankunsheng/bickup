import axios from "axios";
import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { handleResponse, verifyAndDecodeJWT } from "./lib/helper";
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda"
import * as jwkToBuffer from "jwk-to-pem";

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
const createJob = async function (event: APIGatewayProxyEvent, context: any) {
  if(!event.body){
    return handleResponse(event, {
      statusCode: 400,
      body: JSON.stringify({
        message: `Empty request body received`,
      }),
    });
  }
  const reqBody = JSON.parse(event.body);
  const contact_no = reqBody.contact_no;
  const origin = reqBody.origin;
  const numBikes = reqBody.numBikes;
  const numPax = reqBody.numPax;
  const destinations = reqBody.destinations;
  const pickupDate = reqBody.pickupDate;
  const pickupTime = reqBody.pickupTime;

  if (!process.env.JOBS_TABLE) {
    console.log("Jobs table name not specified");
    return;
  }
  const now = new BetterDate();
  now.addHours(8);

  const params = {
    Item: {
      contact_no: contact_no,
      created_at: now.toISOString(),
      id: uuid(),
      origin,
      destinations,
      pickupDate,
      pickupTime,
      numBikes,
      numPax,
      status: "open"
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
    return handleResponse(event, {
      statusCode: 200,
      body: JSON.stringify({
        message: `Created Job for contact_no ${contact_no} at ${now.toISOString()}`,
      }),
    });
  } catch (err) {
    console.log("Error", err);
    return handleResponse(event, {
      statusCode: 500,
      body: JSON.stringify({
        message: err,
      }),
    });
  }
};
const getJob = async function (event: any, context: any) {
  if (!process.env.JOBS_TABLE) {
    console.log("Jobs table name not specified");
    return;
  }
  const contact_no = event.pathParameters.contact_no;
  const created_at = event.queryStringParameters.datetime;
  const params = {
    Key: {
      contact_no: contact_no,
      created_at: created_at,
    },
    TableName: process.env.JOBS_TABLE,
  };
  const job = await new Promise<AWS.DynamoDB.DocumentClient.GetItemOutput>(
    (resolve, reject) => {
      client.get(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          console.log(`resolved data is ${data}`);
          resolve(data);
        }
      });
    }
  ).catch((err) => {
    console.log("Error", err);
    return handleResponse(event, {
      body: JSON.stringify({
        statusCode: 500,
        message: err,
      }),
    });
  });
  console.log("job retrieved");
  console.log(job);
  return handleResponse(event, {
    statusCode: 200,
    body: JSON.stringify({
      job: job.Item,
    }),
  });
};

const patchJob = async function(event:APIGatewayProxyEvent, context:any){
  // if(!event.body){
  //   return handleResponse(event, {
  //     statusCode: 400,
  //     body: JSON.stringify({
  //       message: `Empty request body received`,
  //     }),
  //   });
  // }
  //header 'Authorizer' will always be provided since apigateway authorizer ensures of this
  //optional check included just in case
  console.log(`jwkToBuffer type is ${typeof jwkToBuffer}`)
  console.log(jwkToBuffer)
  const idToken = event.headers.Authorizer
  if(!idToken){
    return handleResponse(event, {
      statusCode: 400,
      body: JSON.stringify({
        message: `Authorizer header missing`,
      }),
    });
  }
  const decoded = verifyAndDecodeJWT(idToken)
  // const reqBody = JSON.parse(event.body);
  const headers = event.headers
  console.log(headers)
  console.log(JSON.stringify(headers))
  // console.log(reqBody)

  //update dynamodb record with the driver's email
  return handleResponse(event, {
    statusCode: 200,
    body: JSON.stringify({
      message: `your headers are ${JSON.stringify(headers)} decoded ${decoded.email}`
    }),
  });
}


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
    const record = event.Records[0].dynamodb.NewImage;
    console.log(record);
    console.log(record.origin);
    console.log(record.id);
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        parse_mode: "HTML",
        chat_id: process.env.CHAT_ID,
        text: `New Job Created\n<b>Pick up at: ${record.origin.S}</b>\n<a href="${process.env.SERVER}/jobs/${record.contact_no.S}?datetime=${record.created_at.S}">Click to View</a>`,
        // text: `${event.Records[0].eventName} event. New data = ${JSON.stringify(
        //   event.Records[0].dynamodb.NewImage
        // )}`,
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
export { createJob, handleJobStream, getJob, patchJob };

//Lambda proxy integration expects responses to be in the following format
// {
//   "isBase64Encoded": true|false,
//   "statusCode": httpStatusCode,
//   "headers": { "headerName": "headerValue", ... },
//   "multiValueHeaders": { "headerName": ["headerValue", "headerValue2", ...], ... },
//   "body": "..."
// }
// Refer to https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html for more details
