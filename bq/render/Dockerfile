FROM gcr.io/nodepen-io/np-builder:rq

# Build headless-gl
RUN git clone https://github.com/stackgl/headless-gl.git && \
    cd headless-gl && \
    git checkout ed592e346c142c5312bcc10e8f27a7d362b40ef6 && \
    git submodule init && \
    git submodule update && \
    npm install && \
    npm run rebuild && \
    npm link && \
    cd ..

# Build np-render
COPY package.json package-lock.json ./

RUN npm config set python /usr/local/bin/python3 && \
    npm link gl && \
    npm install

COPY src ./src
COPY glib ./glib
COPY fonts ./fonts
COPY img ./img
COPY tsconfig.json ./tsconfig.json

RUN npm run build

# Run np-render
ENV DISPLAY :99.0

EXPOSE 9700

ADD start.sh /start.sh
RUN chmod a+x /start.sh

CMD /start.sh