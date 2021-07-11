const config = {
    dev: {
        deploymentEnv: "dev",
        jobsTable: "dev-bickup-jobs-table",
        chatId: "-1001555317155",
        botTokenARN: "arn:aws:secretsmanager:ap-southeast-1:860039660571:secret:dev/bickup/bot/token-WvawqR",
        server: "http://dev-bickup-static-site.s3-website-ap-southeast-1.amazonaws.com"
        // server: "http://127.0.0.1:8000" //local dev
    },
    prod: {
        deploymentEnv: "prod",
        jobsTable: "prod-bickup-jobs-table",
        chatId: "",
        botTokenARN: "",
        server: ""
    }
}
const env = process.env.env as keyof typeof config
export default config[env]