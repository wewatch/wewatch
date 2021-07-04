FROM node:14.17.1-alpine3.13

WORKDIR /usr/wewatch

COPY .yarn ./.yarn
COPY .yarnrc.yml .
COPY package.json .
COPY yarn.lock .
COPY tsconfig* .
COPY packages/common ./packages/common
COPY packages/api ./packages/api

RUN yarn set version berry

WORKDIR /usr/wewatch/packages/api

RUN yarn workspaces focus
RUN yarn build

EXPOSE 8080
CMD ["yarn", "start:prod"]
