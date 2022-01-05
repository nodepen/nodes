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
  xvfb \
  ffmpeg

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9700

ENV DISPLAY :99.0

ADD start.sh /start.sh
RUN chmod a+x /start.sh

CMD /start.sh