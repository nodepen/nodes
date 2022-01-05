FROM node:12-alpine AS dependencies
WORKDIR /bq/io
COPY package.json package-lock.json ./
RUN npm install

FROM node:12-alpine AS builder
WORKDIR /bq/io
COPY . .
COPY --from=dependencies /bq/io/node_modules ./node_modules
RUN npm install && npm run build

FROM node:12-alpine AS runner
WORKDIR /bq/io

ENV NODE_ENV production

COPY --from=builder /bq/io/dist ./dist
COPY --from=builder /bq/io/node_modules ./node_modules
COPY --from=builder /bq/io/package.json ./package.json

EXPOSE 9600

CMD ["npm", "run", "start"]