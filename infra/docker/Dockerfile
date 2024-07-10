ARG NODE_VERSION=20.15.1-bookworm

FROM node:${NODE_VERSION} AS base

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
	--mount=type=cache,target=/var/lib/apt,sharing=locked \
	rm -f /etc/apt/apt.conf.d/docker-clean \
	; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache \
	&& apt-get update \
	&& apt-get install -yqq --no-install-recommends \
	python3

RUN corepack enable

WORKDIR /jetdisc

COPY --link ["pnpm-lock.yaml", "package.json", "./"]

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS builder
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY --link . ./

ARG NODE_ENV=production
RUN pnpm build

FROM node:${NODE_VERSION}-slim AS runner

ARG UID="991"
ARG GID="991"

RUN apt-get update \
	&& apt-get upgrade -y \
	&& apt-get install -y --no-install-recommends \
	ffmpeg tini \
	&& corepack enable \
	&& groupadd -g "${GID}" jetdisc \
	&& useradd -l -u "${UID}" -g "${GID}" -m -d /jetdisc jetdisc \
	&& find / -type d -path /proc -prune -o -type f -perm /u+s -ignore_readdir_race -exec chmod u-s {} \; \
	&& find / -type d -path /proc -prune -o -type f -perm /g+s -ignore_readdir_race -exec chmod g-s {} \; \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists

USER jetdisc
WORKDIR /jetdisc

COPY --chown=jetdisc:jetdisc --from=prod-deps /jetdisc/node_modules ./node_modules
COPY --chown=jetdisc:jetdisc --from=builder /jetdisc/built ./built
COPY --chown=jetdisc:jetdisc . ./

ENV NODE_ENV=production

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["pnpm", "run", "start"]
