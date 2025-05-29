using Habitaciones.Models;
using MongoDB.Driver;
using Habitaciones.Data;

namespace Habitaciones.Services
{
  public class HabitacionMongoService : IHabitacionService
  {
    private readonly IMongoCollection<HabitacionMongo> _habitaciones;

    public HabitacionMongoService(MongoContext context)
    {
      _habitaciones = context.HabitacionMongo;
    }

    public async Task<List<HabitacionMongo>> GetAllHabitaciones() =>
        await _habitaciones.Find(_ => true).ToListAsync();

    public async Task<HabitacionMongo?> GetHabitacion(string id) =>
        await _habitaciones.Find(h => h.Id == id).FirstOrDefaultAsync();

    public async Task<HabitacionMongo> AddHabitacion(HabitacionMongo habitacion)
    {
      await _habitaciones.InsertOneAsync(habitacion);
      return habitacion;
    }

    public async Task<HabitacionMongo?> UpdateHabitacion(string id, HabitacionMongo habitacionMongo)
    {
      var resultado = await _habitaciones.ReplaceOneAsync(h => h.Id == id, habitacionMongo);
      if (resultado.ModifiedCount > 0)
        return habitacionMongo;
      else
        return null;
    }

    public async Task<HabitacionMongo?> DeleteHabitacion(string id)
    {
      var resultado = await _habitaciones.DeleteOneAsync(h => h.Id == id);
      if (resultado.DeletedCount > 0)
        return null; // O devuelve el eliminado si lo tienes guardado antes
      else
        return null;
    }
  }
}