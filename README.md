# Node Tyrant Api

Umbrella Corp's Microservice (fictitious but functional) as a transport layer for mathematical operations coming from the [Phoenix Neptune App](https://github.com/angel-zguerrero/phoenix-neptune-app).

Written in NodeJs with NestJS using MongoDB as a backend to store the state of the operations, Redis to store the operation count and a connection with RabbitMQ to send and receive the operations and their results from [Elixir Pendulum App](https://github.com/angel-zguerrero/elixir-pendulum-app)

## See in action

You can see all the ecosystem in action of this this distributed service deploying [Distributed Hive Network](https://github.com/angel-zguerrero/hive-docker/blob/main/distributed-hive-network).

## Tech Stack

- [NestJS](https://docs.nestjs.com)
- [TypeScript](https://www.typescriptlang.org)
- [MongoDB](https://www.mongodb.com/es)

## Techniques

- [Dependency Injection Pattern](https://docs.nestjs.com/providers#dependency-injection)
- [Middleware Pattern](https://docs.nestjs.com/middleware)
- [Decorator Pattern](https://docs.nestjs.com/custom-decorators#decorator-composition) 
- [ORM](https://docs.nestjs.com/techniques/mongodb)
- [Docker Container](https://www.docker.com/resources/what-container)

## Installation

```bash
$ npm install
```

## Configuring the app

Edit ***./.env*** file to use your own ENV VARS to configure Redis, MongoDB, Rabbitmq and the Application itself.

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

## How to use

### Send operation to resolve

#### Factorial request

```bash
curl --location --request POST 'http://localhost:3000/scientist-operator/solve' \
--header 'Content-Type: application/json' \
--data-raw '{
   "operation":{"type": "factorial", "values": 7} 
}'
```

#### Factorial response
```javascript

{
    "register": {
        "operation": {
            "type": "factorial",
            "values": 7
        },
        "status": "pending",
        "ttl": "2023-09-15T22:03:58.511Z",
        "_id": "65038494b94b8a10065fd59a",
        "createdAt": "2023-09-14T22:09:24.058Z",
        "updatedAt": "2023-09-14T22:09:24.058Z",
        "__v": 0
    },
    "publish": "publish-ok"
}

```

### Get details of the operation and its status

#### Detail operation request

Replace ***:id*** parameter in the url

```bash
curl --location --request GET 'http://localhost:3000/scientist-operator/find/:id' \
--data-raw ''
```


#### Detail operation response

```javascript

{
    "_id": "65038494b94b8a10065fd59a",
    "operation": {
        "type": "factorial",
        "values": 7
    },
    "status": "pending",
    "ttl": "2023-09-15T22:03:58.511Z",
    "createdAt": "2023-09-14T22:09:24.058Z",
    "updatedAt": "2023-09-14T22:09:24.058Z",
    "__v": 0
}

```

### Search operation by criteria

#### Search operation request

Use MongoDB query in the request body filter

```bash
curl --location --request GET 'http://localhost:3000/scientist-operator/search' \
--header 'Content-Type: application/json' \
--data-raw '{
  "filter": {
      "status": "failed",
      "updatedAt": {
          "$gte": "2023-09-14T22:18:28.472Z"
      }
  },
  "sort":  1,
  "limit": 100,
  "fieldOrder": "updatedAt",
  "cursor": ""
}'
```

#### Search operation response

Use cursor value to call the endpoint to pass to the next page

```javascript
{
    "results": [
        {
            "_id": "6503844db94b8a10065fd591",
            "status": "failed",
            "ttl": "2023-09-15T22:03:58.511Z",
            "createdAt": "2023-09-14T22:08:13.901Z",
            "updatedAt": "2023-09-14T22:18:28.472Z",
            "__v": 0,
            "failedReason": "Timeout for operation resolution"
        },
        ......
    ],
    "cursor": "3cbab97da4670490d67ffc90de3cc3857cfdad0262da94f64395098cb8811f66aad6df1a22db6326d2d61849afabf2ef34ded563bb1129aad42acdff82f65008e7bbc0c1c4dee76fd55c71c9f2f3b2b7e8832d0d9159eee1490dd2f996a5defcffc0e49ed95218955e4397054b79d6af14"
}

```

The last page returns an ***empty result array*** and none ***cursor***

### Webhook to listen to change status operations

This Microservice sends a post request to the url configured in ***SCIENTIST_OPERATIONS_NOTIFICATION_WEBHOOK*** ENV VAR with the operation IDs that were updated, use their ids with ***"Detail operation request"***  endpoint to know their status


```javascript
{
  "code": "timeout-for-operation-resolution-notification",
  "operation_ids": [
    "65038ce7256a646b30a64e47"
  ]
}

```

## Docker

This application can be easily run on Docker. You can use `Dockerfile` to create and push the image to a Docker repository for use in a production environment.

You can run this application and its services using the `compose-file.yaml` docker.

```bash
$ docker-compose up --build
```

### Note

Before running this service, you must first run this application [Elixir Pendulum App](https://github.com/angel-zguerrero/elixir-pendulum-app).

## Author

[@angel-zguerrero](https://github.com/angel-zguerrero)