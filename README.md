# Node Tyrant Api

Umbrella Corp's Microservice (fictitious but functional) as a transport layer for mathematical operations coming from the [Phoenix Neptune App](https://github.com/angel-zguerrero/phoenix-neptune-app).

Written in NodeJs with NestJS using MongoDB as a backend to store the state of the operations, Redis to store the operation count and a connection with RabbitMQ to send and receive the operations and their results to [Elixir Pendulum App](https://github.com/angel-zguerrero/elixir-pendulum-app)


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```