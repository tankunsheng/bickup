const baseConfig = {
  corsWhitelist: [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://dev-bickup-static-site.s3-website-ap-southeast-1.amazonaws.com",
    "https://d3bojbdeh120he.cloudfront.net",
  ],
};
const config = {
  dev: {
    deploymentEnv: "dev",
    jobsTable: "dev-bickup-jobs-table",
    chatId: "-1001555317155",
    botTokenARN:
      "arn:aws:secretsmanager:ap-southeast-1:860039660571:secret:dev/bickup/bot/token-WvawqR",
    server: "https://d3bojbdeh120he.cloudfront.net",
    // "http://dev-bickup-static-site.s3-website-ap-southeast-1.amazonaws.com",
    // server: "http://127.0.0.1:8000" //local dev
  },
  prod: {
    deploymentEnv: "prod",
    jobsTable: "prod-bickup-jobs-table",
    chatId: "",
    botTokenARN: "",
    server: "",
  },
};
const env = process.env.env as keyof typeof config;
export default {
  ...baseConfig,
  ...config[env],
};
