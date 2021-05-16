const submit = (event, context, callback) => {
  const whitelistedOrigin = [
    "http://localhost:8000",
    "http://dev-static-bickup.s3-website-ap-southeast-1.amazonaws.com",
  ].find((whitelistOrigin) => whitelistOrigin === event.headers.origin);
  console.log(whitelistedOrigin ?? "nothing")
  console.log(whitelistedOrigin)
  const response = {
    statusCode: 200,
    headers: {
      //   1. https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
      //   2. https://stackoverflow.com/questions/24687313/what-exactly-does-the-access-control-allow-credentials-header-do#:~:text=In%20order%20to%20reduce%20the,to%20include%20cookies%20on%20requests.&text=Responding%20with%20this%20header%20to,included%20on%20cross%2Dorigin%20requests.
      "Access-Control-Allow-Origin": whitelistedOrigin ?? "", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for CORS support to work
    },
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event,
    }),
  };
  console.log(event);
  console.log(context);
  callback(null, response);
};
module.exports = {
  submit,
};
