const config = {
    dev: {
        deploymentEnv: "dev",
        chatId: "-334215881"
    },
    prod: {
        deploymentEnv: "prod",
        chatId: ""
    }
}
const env = process.env.env as keyof typeof config
export default config[env]