FROM jrottenberg/ffmpeg:4.1
WORKDIR /bq/render

COPY . .

RUN apt-get update && \
  apt-get -y install curl && \
  curl -sL https://deb.nodesource.com/setup_12.x | bash && \
  apt-get -y install nodejs && \
  node -v && \
  npm -v

ENV NODE_ENV production

RUN npm install && \
  npm run build

EXPOSE 9700

CMD ["npm", "run", "start"]