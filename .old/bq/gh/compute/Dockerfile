# escape=`

### Build dotnet and msbuild dependencies
FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 as builder

RUN `
    # Download the Build Tools bootstrapper.
    curl -SL --output vs_buildtools.exe https://aka.ms/vs/16/release/vs_buildtools.exe `
    `
    # Install Build Tools with the Microsoft.VisualStudio.Workload.AzureBuildTools workload, excluding workloads and components with known issues.
    && (start /w vs_buildtools.exe --quiet --wait --norestart --nocache modify `
        --installPath "%ProgramFiles(x86)%\Microsoft Visual Studio\2019\BuildTools" `
        --add Microsoft.VisualStudio.Workload.AzureBuildTools `
        --remove Microsoft.VisualStudio.Component.Windows10SDK.10240 `
        --remove Microsoft.VisualStudio.Component.Windows10SDK.10586 `
        --remove Microsoft.VisualStudio.Component.Windows10SDK.14393 `
        --remove Microsoft.VisualStudio.Component.Windows81SDK `
        || IF "%ERRORLEVEL%"=="3010" EXIT 0) `
    `
    # Cleanup
    && del /q vs_buildtools.exe

# copy everything, restore nuget packages and build app
COPY . .
RUN ["powershell", "& \"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\MSBuild\\Current\\Bin\\MsBuild.exe\" /r /property:Configuration=Release /property:Platform=x64 NodePen.Compute.sln"]

# Pull windows image compatible with build pipeline
FROM mcr.microsoft.com/windows:10.0.19042.1110

# Install rhino (with “-package -quiet” args)
RUN curl -fSLo rhino_installer.exe https://files.mcneel.com/dujour/exe/20210810/rhino_en-us_7.9.21222.15001.exe `
    && .\rhino_installer.exe -package -quiet `
    && del .\rhino_installer.exe

# Copy compute app to image
COPY --from=builder ["/bin/Release", "/app"]
WORKDIR /app

# Bind compute.geometry to port 9900
ENV RHINO_COMPUTE_URLS="http://+:9900"
EXPOSE 9900

# Pass in NodePen's compute token
ARG NODEPEN_RHINO_TOKEN

ENV RHINO_TOKEN $NODEPEN_RHINO_TOKEN

CMD ["compute.geometry.exe"]