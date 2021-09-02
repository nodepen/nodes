# escape=`

# see https://discourse.mcneel.com/t/docker-support/89322 for troubleshooting

# NOTE: use 'process' isolation to build image (otherwise rhino fails to install)

### builder image
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
# RUN ["powershell", "& \"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\Common7\\Tools\\VsDevCmd.bat\" NodePen.Compute.csproj"]
RUN ["powershell", "& \"C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\BuildTools\\MSBuild\\Current\\Bin\\MsBuild.exe\" /r /property:Configuration=Release /property:Platform=x64 NodePen.Compute.sln"]
# RUN dotnet restore NodePen.Compute.csproj
# RUN dotnet build NodePen.Compute.csproj --configuration Release --force

### main image
# tag must match windows host for build (and run, if running with process isolation)
# e.g. 1903 for Windows 10 version 1903 host
# FROM mcr.microsoft.com/windows:20H2
# FROM mcr.microsoft.com/windows:1903
FROM mcr.microsoft.com/windows:10.0.19042.1110
# FROM mcr.microsoft.com/windows/servercore:20H2
# FROM mcr.microsoft.com/windows/servercore:19042.1165

# install .net 4.8 if you're using the 1809 base image (see https://git.io/JUYio)
# comment this out for 1903 and newer
# RUN curl -fSLo dotnet-framework-installer.exe https://download.visualstudio.microsoft.com/download/pr/7afca223-55d2-470a-8edc-6a1739ae3252/abd170b4b0ec15ad0222a809b761a036/ndp48-x86-x64-allos-enu.exe `
#     && .\dotnet-framework-installer.exe /q `
#     && del .\dotnet-framework-installer.exe `
#     && powershell Remove-Item -Force -Recurse ${Env:TEMP}\*

# install rhino (with “-package -quiet” args)
# NOTE: edit this if you use a different version of rhino!
# the url below will always redirect to the latest rhino 7 (email required)
# https://www.rhino3d.com/download/rhino-for-windows/7/latest/direct?email=EMAIL
# https://files.mcneel.com/dujour/exe/20210319/rhino_en-us_7.4.21078.01001.exe
# https://files.mcneel.com/dujour/exe/20210810/rhino_en-us_7.9.21222.15001.exe
RUN curl -fSLo rhino_installer.exe https://files.mcneel.com/dujour/exe/20210810/rhino_en-us_7.9.21222.15001.exe `
    && .\rhino_installer.exe -package -quiet `
    && del .\rhino_installer.exe

# (optional) use the package manager to install plug-ins
# RUN ""C:\Program Files\Rhino 7\System\Yak.exe"" install jswan

# copy compute app to image
COPY --from=builder ["/bin/Release", "/app"]
WORKDIR /app

# bind compute.geometry to port 9900
ENV RHINO_COMPUTE_URLS="http://+:9900"
EXPOSE 9900

# uncomment to build core-hour billing credentials into image (not recommended)
# see https://developer.rhino3d.com/guides/compute/core-hour-billing/
#ENV RHINO_TOKEN TOKEN_HERE

ARG NODEPEN_RHINO_TOKEN

ENV RHINO_TOKEN $NODEPEN_RHINO_TOKEN

CMD ["compute.geometry.exe"]