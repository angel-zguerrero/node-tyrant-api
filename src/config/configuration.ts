export default () => ({
  mongodb: {
    uri: process.env.MONGO_RS_URL,
    ssl: false,
    tlsAllowInvalidHostnames: false,
    sslValidate: false,
    sslCA: ''
  },
  redis: {
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
  },
  rabbitmq:{
    url: process.env.RABBITMQ_URL,
    "scientist-request-queue": process.env.RABBITMQ_SCIENTIST_REQUEST_QUEUE,
    "scientist-response-queue": process.env.RABBITMQ_SCIENTIST_RESPONSE_QUEUE
  }
});