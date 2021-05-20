const AWS = require("aws-sdk");
AWS.config.setPromisesDependency(require("bluebird"));
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { handleResponse } = require("./lib/helper");

const submit = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const clientNumber = requestBody.clientNumber;
  const srcLocation = requestBody.srcLocation;
  const destLocation = requestBody.destLocation;

  if (
    typeof clientNumber !== "string" 
  ) {
    console.error("Validation Failed");
    callback(
      new Error("Couldn't submit clientNumber because of validation errors.")
    );
    return;
  }
  const createJob = (job) => {
    console.log("Submitting job");
    const jobInfo = {
      TableName: process.env.TableName,
      Item: job,
    };
    return dynamoDb.put(jobInfo).promise();
  };
  const timestamp = new Date().getTime();

  return createJob({
    clientNumber: clientNumber,
    timestamp: timestamp,
    srcLocation: srcLocation,
    destLocation: destLocation,
  }).then((response) => {
    return handleResponse(event, {
      ...response,
      body: JSON.stringify({
        message: `Sucessfully submitted clientNumber: ${clientNumber}`,
      }),
    });
  });
  // Below is the async await equivalent that works as well
  // const response = await submitCandidateP({
  //   clientNumber: clientNumber,
  //   timestamp: timestamp,
  //   bicycleModel: bicycleModel,
  //   srcLocation: srcLocation,
  //   destLocation: destLocation,
  // });
  // return handleResponse(event, {
  //   ...response,
  //   body: JSON.stringify({
  //     message: `Sucessfully submitted clientNumber: ${clientNumber}`,
  //   }),
  // });
};

module.exports = {
  submit,
};
