FROM gcr.io/nodepen-io/np-builder:latest
WORKDIR /bq/render

COPY . .

RUN npm install && \
  npm run build

EXPOSE 9700

CMD ["npm", "run", "start"]