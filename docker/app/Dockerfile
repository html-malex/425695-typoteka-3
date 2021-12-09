FROM node:16 AS base

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

USER node
WORKDIR /home/node/app

COPY --chown=node . ./

FROM base AS deps
COPY --chown=node package.json package-lock.json ./
RUN npm ci

FROM deps AS app
COPY --chown=node src ./src/
COPY --chown=node markup ./markup/

CMD /wait && npm run filldb --100 && npm start

