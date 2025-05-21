# Etapa de build y publish
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia el csproj y restaura dependencias
COPY ["Eventos.csproj", "./"]
RUN dotnet restore

# Copia todo y publica en Release
COPY . .
RUN dotnet publish "Eventos.csproj" -c Release -o /app/publish

# Etapa de runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copia los artefactos publicados
COPY --from=build /app/publish .

# Exponemos puertos
EXPOSE 80
EXPOSE 443

# Arranca la app desde el DLL publicado
ENTRYPOINT ["dotnet", "Eventos.dll"]
