FROM node:19-bullseye AS builder

WORKDIR /app

COPY . ./

RUN yarn install \
		&& yarn build

FROM node:19-bullseye-slim AS runner

RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

WORKDIR /app

RUN apt-get update && apt-get install --no-install-recommends -y tini ffmpeg \
	&& apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /root/.gnupg /tmp/library-scripts

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/built ./built
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=container
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["yarn", "start"]
