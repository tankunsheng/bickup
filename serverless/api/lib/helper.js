const whitelist = [
  "http://localhost:8000",
  "http://dev-static-bickup.s3-website-ap-southeast-1.amazonaws.com",
];
const checkIfOriginIsCorsWhitelisted = (whitelist, origin) => {
  return whitelist.find(
    (whitelistOrigin) => whitelistOrigin === origin
  );
};
const handleResponse = (request, response) => {
  const whitelistOrigin = checkIfOriginIsCorsWhitelisted(
    whitelist,
    request.headers.origin
  );
  console.log("in handleresponse")

  console.log(whitelistOrigin);
  console.log({
    ...response,
    statusCode: 200,
    headers: {
      //   1. https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
      //   2. https://stackoverflow.com/questions/24687313/what-exactly-does-the-access-control-allow-credentials-header-do#:~:text=In%20order%20to%20reduce%20the,to%20include%20cookies%20on%20requests.&text=Responding%20with%20this%20header%20to,included%20on%20cross%2Dorigin%20requests.
      // "Access-Control-Allow-Origin": whitelistOrigin ?? "*", // Required for CORS support to work
      "Access-Control-Allow-Origin":  "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for CORS support to work
    }
  });
  return {
    ...response,
    statusCode: 200,
    headers: {
      //   1. https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
      //   2. https://stackoverflow.com/questions/24687313/what-exactly-does-the-access-control-allow-credentials-header-do#:~:text=In%20order%20to%20reduce%20the,to%20include%20cookies%20on%20requests.&text=Responding%20with%20this%20header%20to,included%20on%20cross%2Dorigin%20requests.
      "Access-Control-Allow-Origin": whitelistOrigin ?? "", // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for CORS support to work
    },
  };
};
module.exports = {
  handleResponse,
};
