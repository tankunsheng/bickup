const config = {
    dev: {
        deploymentEnv: "dev",
        jobsTable: "dev-bickup-jobs-table",
        chatId: "-334215881",
        botTokenARN: "arn:aws:secretsmanager:ap-southeast-1:860039660571:secret:dev/bickup/bot/token-WvawqR"
    },
    prod: {
        deploymentEnv: "prod",
        jobsTable: "prod-bickup-jobs-table",
        chatId: "",
        botTokenARN: ""
    }
}
const env = process.env.env as keyof typeof config
export default config[env]