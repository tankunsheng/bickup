const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();


const { handleResponse } = require("./lib/helper");

const submit = async (event, context) => {
  const requestBody = JSON.parse(event.body);
  console.log(requestBody);
  const clientNumber = requestBody.clientNumber;
  const bicycleModel = requestBody.bicycleModel;
  const srcLocation = requestBody.srcLocation;
  const destLocation = requestBody.destLocation;

  if (typeof clientNumber !== 'string' || typeof bicycleModel !== 'string' || typeof srcLocation !== 'string' || typeof destLocation !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit clientNumber because of validation errors.'));
    return;
  }
  const submitCandidateP = candidate => {
    console.log('Submitting candidate');
    const candidateInfo = {
      TableName: process.env.TableName,
      Item: candidate,
    };
    return dynamoDb.put(candidateInfo).promise()
      .then(res => candidate);
  };
  const timestamp = new Date().getTime();
  return submitCandidateP({
    clientNumber: clientNumber,
    timestamp: timestamp,
    bicycleModel: bicycleModel,
    srcLocation: srcLocation,
    destLocation: destLocation,
  })
    .then(res => {
      console.log("start to ...");
      return handleResponse(event, { ...res, body: JSON.stringify({ message: `Sucessfully submitted clientNumber: ${clientNumber}` }) });
      // callback(null, {
      //   statusCode: 200,
      //   body: JSON.stringify({
      //     message: `Sucessfully submitted clientNumber: ${clientNumber}`
      //   })
      // });
    })
    .catch(err => {
      console.log("catch err");
      console.log(err);
      // callback(null, {
      //   statusCode: 500,
      //   body: JSON.stringify({
      //     message: `Unable to submit candidate with  clientNumber: ${clientNumber}`
      //   })
      // })
    });
};

module.exports = {
  submit,
};

// module.exports.submit = (event, context, callback) => {
//   const requestBody = JSON.parse(event.body);
//   const clientNumber = requestBody.clientNumber;  
//   const bicycleModel = requestBody.bicycleModel;  
//   const srcLocation = requestBody.srcLocation;  
//   const destLocation = requestBody.destLocation;


//   if (typeof clientNumber !== 'string' || typeof bicycleModel !== 'string' || typeof srcLocation !== 'string' || typeof destLocation !== 'string' ) {
//     console.error('Validation Failed');
//     callback(new Error('Couldn\'t submit clientNumber because of validation errors.'));
//     return;
//   }
// //
//   submitCandidateP(candidateInfo(clientNumber,bicycleModel,srcLocation,destLocation))
//     .then(res => {
//       callback(null, {
//         statusCode: 200,
//         body: JSON.stringify({
//           message: `Sucessfully submitted clientNumber: ${clientNumber}`
//         })
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       callback(null, {
//         statusCode: 500,
//         body: JSON.stringify({
//           message: `Unable to submit candidate with  clientNumber: ${clientNumber}`
//         })
//       })
//     });
// };


// const submitCandidateP = candidate => {
//   console.log('Submitting candidate');
//   const candidateInfo = {
//     TableName: process.env.TableName,
//     Item: candidate,
//   };
//   return dynamoDb.put(candidateInfo).promise()
//     .then(res => candidate);
// };

// const candidateInfo = (clientNumber,bicycleModel,srcLocation,destLocation) => {
//   const timestamp = new Date().getTime();
//   return {
//     clientNumber: clientNumber,
//     timestamp: timestamp,
//     bicycleModel: bicycleModel,
//     srcLocation:srcLocation,
//     destLocation:destLocation,
//   };
// };

/* previous */
// const submit = async (event, context) => {
//   const response = {
//     body: JSON.stringify({
//       message: "Go Serverless v1.0! Your function executed successfully!",
//       input: event,
//     }),
//   };
//   console.log(event);
//   console.log(context);
//   return handleResponse(event, response);
// };
// module.exports = {
//   submit,
// };
