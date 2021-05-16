const submit = (event, context, callback) => {
  const response = {
    statusCode: 200,
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
