FROM node:18-bullseye AS builder

RUN apt-get update && apt-get install -y tini
# ARG NODE_ENV=production

WORKDIR /app

COPY . ./

RUN yarn install
RUN yarn build
RUN rm -rf .git

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD yarn start
