const { handleResponse } = require("./lib/helper");
const submit = async (event, context) => {
  const response = {
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event,
    }),
  };
  console.log(event);
  console.log(context);
  return handleResponse(event, response);
};
module.exports = {
  submit,
};
