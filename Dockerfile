FROM node:18-bullseye AS builder

RUN apt-get update && apt-get install -y tini

WORKDIR /app

COPY . ./

# RUN apt update
# RUN apt install -y build-essential
RUN yarn install
RUN yarn build
RUN rm -rf .git

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD yarn start
