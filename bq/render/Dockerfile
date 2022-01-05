FROM node:12-alpine AS builder
WORKDIR /bq/render
COPY . .
COPY --from=dependencies /bq/render/node_modules ./node_modules

RUN apk add --no-cache --virtual .build-deps alpine-sdk python
RUN npm install && npm run build

FROM node:12-alpine AS runner
WORKDIR /bq/render

ENV NODE_ENV production
ENV PORT 4000

COPY --from=builder /bq/render/dist ./dist
COPY --from=builder /bq/render/node_modules ./node_modules
COPY --from=builder /bq/render/package.json ./package.json

RUN apk update && \
  apk add && \
  apk add ffmpeg

EXPOSE 4000
EXPOSE 8080

CMD ["npm", "run", "start"]