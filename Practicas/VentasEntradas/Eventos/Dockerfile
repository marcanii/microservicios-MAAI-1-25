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

# Establece el puerto de escucha en 4001
ENV ASPNETCORE_URLS=http://+:4001

# Expone el puerto 4001
EXPOSE 4001

# Ejecuta la aplicación
ENTRYPOINT ["dotnet", "Eventos.dll"]
