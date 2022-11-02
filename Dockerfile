# Container image that runs your code
FROM node:16 AS builder

WORKDIR /

RUN yarn install && yarn build