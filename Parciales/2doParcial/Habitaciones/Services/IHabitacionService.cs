using Habitaciones.Models;

namespace Habitaciones.Services
{
  public interface IHabitacionService
  {
    Task<List<HabitacionMongo>> GetAllHabitaciones();
    Task<HabitacionMongo?> GetHabitacion(string id);
    Task<HabitacionMongo> AddHabitacion(HabitacionMongo habitacion);
    Task<HabitacionMongo?> UpdateHabitacion(string id, HabitacionMongo habitacionMongo);
    Task<HabitacionMongo?> DeleteHabitacion(string id);
  }
}