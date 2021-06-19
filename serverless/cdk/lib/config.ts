const config = {
    dev: {
        deploymentEnv: "dev"
    },
    prod: {
        deploymentEnv: "prod"
    }
}
const env = process.env.env as keyof typeof config
export default config[env]