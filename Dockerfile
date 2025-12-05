# syntax=docker/dockerfile:1

FROM registry.eeo-inc.com/co-engine/node-base:22.15.0 AS deps

ARG PROJECT_NAME=doc-tpl
WORKDIR /${PROJECT_NAME}
COPY .npmrc pnpm-lock.yaml package.json ./
COPY scripts/preinstall.js ./scripts/preinstall.js
RUN --mount=type=cache,target=/root/.pnpm-store \
  pnpm config set store-dir /root/.pnpm-store \
  && pnpm install --prod

FROM registry.eeo-inc.com/co-engine/node-base:22.15.0 AS app
# 使用东八区时间
RUN apt-get update && \
  apt-get install tzdata && \
  ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
# Create app directory
ARG PROJECT_NAME=doc-tpl
WORKDIR /${PROJECT_NAME}
ENV NODE_CONFIG_DIR=/${PROJECT_NAME}/config

# Bundle app source
COPY --from=deps /${PROJECT_NAME}/node_modules ./node_modules
COPY dist ./dist
COPY config ./config
COPY package.json ./dist/package.json

CMD [ "node", "dist/src/server.js" ]