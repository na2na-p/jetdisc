ARG NODE_VERSION=20.9.0-bookworm
ARG DEBIAN_VERSION=bookworm-20231120-slim

FROM debian:${DEBIAN_VERSION} AS base

ARG PYTHON_VERSION=3.11.6

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
	--mount=type=cache,target=/var/lib/apt,sharing=locked \
	rm -f /etc/apt/apt.conf.d/docker-clean \
	; echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' > /etc/apt/apt.conf.d/keep-cache \
	&& apt-get update \
	&& apt-get install -yqq --no-install-recommends \
	build-essential \
	ca-certificates \
	libssl-dev \
	zlib1g-dev \
	libncurses5-dev \
	libncursesw5-dev \
	libreadline-dev \
	libsqlite3-dev \
	libgdbm-dev \
	libdb5.3-dev \
	libbz2-dev \
	libexpat1-dev \
	liblzma-dev \
	tk-dev \
	libffi-dev \
	wget

RUN wget https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tgz \
	&& tar -xzf Python-${PYTHON_VERSION}.tgz \
	&& cd Python-${PYTHON_VERSION} \
	&& ./configure --enable-optimizations \
	&& make -j 8 \
	&& make altinstall \
	&& cd .. \
	&& rm -rf Python-${PYTHON_VERSION}.tgz Python-${PYTHON_VERSION} \
	&& apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
	&& rm -rf /var/lib/apt/lists/*

FROM node:${NODE_VERSION} as builder

COPY --from=base /usr/local /usr/local

RUN corepack enable

WORKDIR /jetdisc

COPY --link ["pnpm-lock.yaml", "package.json", "./"]

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked \
	pnpm i --frozen-lockfile --aggregate-output

COPY --link . ./

ARG NODE_ENV=production
RUN pnpm build

FROM node:${NODE_VERSION}-slim AS runner

ARG UID="991"
ARG GID="991"

RUN apt-get update \
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

COPY --chown=jetdisc:jetdisc --from=builder /jetdisc/node_modules ./node_modules
COPY --chown=jetdisc:jetdisc --from=builder /jetdisc/built ./built
COPY --chown=jetdisc:jetdisc . ./

ENV NODE_ENV=production
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["pnpm", "run", "start"]
