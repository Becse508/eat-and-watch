FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

COPY EatAndWatch/*.csproj ./EatAndWatch/
COPY Entities/*.csproj ./Entities/
RUN dotnet restore EatAndWatch/EatAndWatch.csproj

COPY . .
RUN dotnet publish EatAndWatch/EatAndWatch.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 5144

ENTRYPOINT ["dotnet", "EatAndWatch.dll"]
