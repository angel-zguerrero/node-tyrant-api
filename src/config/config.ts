
export const Config = {
  mongodb: {
    uri: process.env.MONGO_RS_URL,
    ssl: false,
    tlsAllowInvalidHostnames: false,
    sslValidate: false,
    sslCA: ''
  }
}