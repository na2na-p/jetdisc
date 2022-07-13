FROM node:18-bullseye AS builder

WORKDIR /app

COPY . ./

RUN yarn install
RUN yarn build
RUN rm -rf .git

FROM node:18-bullseye-slim AS runner

RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

WORKDIR /app

RUN apt update && apt install --no-install-recommends -y tini ffmpeg

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/built ./built
COPY . ./

ENV NODE_ENV=production
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD yarn start
