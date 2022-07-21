FROM node:18-bullseye AS builder

WORKDIR /app

COPY . ./

RUN yarn install \
		&& yarn build \
		&& rm -rf .git

FROM node:18-bullseye-slim AS runner

RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

WORKDIR /app

RUN apt-get update && apt-get install --no-install-recommends -y tini ffmpeg \
	&& apt-get autoremove -y && apt-get clean -y && rm -rf /var/lib/apt/lists/* /root/.gnupg /tmp/library-scripts

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/built ./built

ENV NODE_ENV=production
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "built/index.js", "--trace-warnings"]
