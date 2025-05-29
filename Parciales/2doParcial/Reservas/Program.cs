using Reservas.Data;
using Reservas.GraphQL.Mutations;
using Reservas.GraphQL.Queries;
using Reservas.GraphQL.Types;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor.
builder.Services.AddDbContextFactory<ReservasDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
        mysqlOptions => mysqlOptions.EnableRetryOnFailure()));

builder.Services.AddPooledDbContextFactory<ReservasDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
        mysqlOptions => mysqlOptions.EnableRetryOnFailure()));

// Configurar GraphQL
builder.Services
    .AddGraphQLServer()
    .AddQueryType<ReservaQueries>()
    .AddMutationType<ReservaMutations>()
    .AddType<ReservaType>()
    .AddType<ReservaInputType>()
    .AddProjections()
    .AddFiltering()
    .AddSorting();

var app = builder.Build();

// Configurar el pipeline HTTP
app.UseHttpsRedirection();

// Crear la base de datos si no existe
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ReservasDbContext>();
    dbContext.Database.EnsureCreated();
}

// Configurar el endpoint de GraphQL
app.MapGraphQL();

app.Run();
