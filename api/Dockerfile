FROM node:12-alpine AS dependencies
WORKDIR /api
COPY package.json package-lock.json ./
RUN npm install

FROM node:12-alpine AS builder
WORKDIR /api
COPY . .
COPY --from=dependencies /api/node_modules ./node_modules
RUN npm install && npm run build

FROM node:12-alpine AS runner
WORKDIR /api

ENV NODE_ENV production
ENV PORT 4000

COPY --from=builder /api/dist ./dist
COPY --from=builder /api/node_modules ./node_modules
COPY --from=builder /api/package.json ./package.json

EXPOSE 4000
EXPOSE 8080

CMD ["npm", "run", "start"]