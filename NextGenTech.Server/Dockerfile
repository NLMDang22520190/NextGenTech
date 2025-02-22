FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5240
EXPOSE 7214

ENV ASPNETCORE_URLS=http://+:5240

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release
WORKDIR /src

COPY ["NextGenTech.Server.csproj", "./"]
RUN dotnet restore "NextGenTech.Server.csproj"

COPY . .
WORKDIR "/src"
RUN dotnet build "NextGenTech.Server.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "NextGenTech.Server.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NextGenTech.Server.dll"]
