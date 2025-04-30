// var builder = WebApplication.CreateBuilder(args);
// var app = builder.Build();

// app.MapGet("/", () => "Hello World!");

// app.Run();


using LibrosGraphQL.Data;
using LibrosGraphQL.GraphQL.Mutations;
using LibrosGraphQL.GraphQL.Queries;
using LibrosGraphQL.GraphQL.Types;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor.
builder.Services.AddDbContextFactory<LibrosDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
        mysqlOptions => mysqlOptions.EnableRetryOnFailure()));

builder.Services.AddPooledDbContextFactory<LibrosDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection")),
        mysqlOptions => mysqlOptions.EnableRetryOnFailure()));

// Configurar GraphQL
builder.Services
    .AddGraphQLServer()
    .AddQueryType<LibroQueries>()
    .AddMutationType<LibroMutations>()
    .AddType<LibroType>()
    .AddType<LibroInputType>()
    .AddProjections()
    .AddFiltering()
    .AddSorting();

var app = builder.Build();

// Configurar el pipeline HTTP
app.UseHttpsRedirection();

// Crear la base de datos si no existe
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<LibrosDbContext>();
    dbContext.Database.EnsureCreated();
}

// Configurar el endpoint de GraphQL
app.MapGraphQL();

app.Run();
