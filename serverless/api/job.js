const AWS = require("aws-sdk");
AWS.config.setPromisesDependency(require("bluebird"));
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { handleResponse } = require("./lib/helper");

const submit = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  const clientNumber = requestBody.clientNumber;
  const bicycleModel = requestBody.bicycleModel;
  const srcLocation = requestBody.srcLocation;
  const destLocation = requestBody.destLocation;

  if (
    typeof clientNumber !== "string" ||
    typeof bicycleModel !== "string" ||
    typeof srcLocation !== "string" ||
    typeof destLocation !== "string"
  ) {
    console.error("Validation Failed");
    callback(
      new Error("Couldn't submit clientNumber because of validation errors.")
    );
    return;
  }
  const submitCandidateP = (candidate) => {
    console.log("Submitting candidate");
    const candidateInfo = {
      TableName: process.env.TableName,
      Item: candidate,
    };
    return dynamoDb.put(candidateInfo).promise();
  };
  const timestamp = new Date().getTime();

  return submitCandidateP({
    clientNumber: clientNumber,
    timestamp: timestamp,
    bicycleModel: bicycleModel,
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
