const config = {
    dev: {
        deploymentEnv: "dev",
        chatId: "-334215881",
        botTokenARN: "arn:aws:secretsmanager:ap-southeast-1:860039660571:secret:dev/bickup/bot/token-WvawqR"
    },
    prod: {
        deploymentEnv: "prod",
        chatId: "",
        botTokenARN: ""
    }
}
const env = process.env.env as keyof typeof config
export default config[env]