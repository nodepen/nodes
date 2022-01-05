FROM node:14
WORKDIR /bq/render

# Get ffmpeg and node-gyp dependencies
RUN apt-get update

RUN apt-get install -y \
  build-essential \
  libxi-dev \
  libglu1-mesa-dev \
  libglew-dev \
  pkg-config \
  ffmpeg

COPY . .

RUN npm install

RUN npm run build

EXPOSE 9700

CMD ["npm", "run", "start"]