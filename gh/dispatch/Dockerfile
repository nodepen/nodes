FROM mcr.microsoft.com/windows:10.0.19042.1110 as installer

SHELL [ "powershell", "-Command", "$ErrorActionPreference = 'Stop';$ProgressPreference='silentlyContinue';" ]

RUN Invoke-WebRequest -OutFile nodejs.zip -UseBasicParsing "https://nodejs.org/dist/v12.18.1/node-v12.18.1-win-x64.zip"; \
    Expand-Archive nodejs.zip -DestinationPath C:\; \
    Rename-Item "C:\\node-v12.18.1-win-x64" c:\nodejs

FROM mcr.microsoft.com/windows/nanoserver:10.0.19042.1110 as runner

WORKDIR C:\\nodejs
COPY --from=installer C:\\nodejs\ .

RUN SETX PATH C:\\nodejs
RUN npm config set registry https://registry.npmjs.org/

# FROM stefanscherer/node-windows:12.18.3-nanoserver-1909

WORKDIR /dispatch

COPY package.json /dispatch/package.json
COPY glib /dispatch/glib
RUN npm install

COPY . /dispatch
RUN npm run build

CMD ["node", "dist/server.js"]


