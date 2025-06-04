using Habitaciones.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Habitaciones.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// MongoDB Configuration
builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));

builder.Services.AddSingleton<IMongoClient>(s =>
    new MongoClient(builder.Configuration.GetConnectionString("MongoDb")));

builder.Services.AddSingleton<MongoContext>();

builder.Services.AddScoped<IHabitacionService, HabitacionMongoService>();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
