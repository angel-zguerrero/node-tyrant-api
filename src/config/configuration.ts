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
    "scientist-operations-to-solve-queue": process.env.RABBITMQ_SCIENTIST_OPERATIONS_TO_SOLVE_QUEUE,
    "scientist-operations-solved-queue": process.env.RABBITMQ_SCIENTIST_OPERATIONS_TO_SOLVED
  },
  workers:{
    "scientist-operator":{
      "stuck-scientist-operations-as-failed-interval": process.env.STUCK_SCIENTIST_OPERATIONS_AS_FAILED_INTERVAL || "1 minute"
    }
  }
});