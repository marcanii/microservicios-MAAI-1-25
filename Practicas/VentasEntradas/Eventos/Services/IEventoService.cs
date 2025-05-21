using Eventos.Models;

namespace Eventos.Services
{
  public interface IEventoService
  {
    Task<List<Evento>> GetAllEventos();
    Task<Evento?> GetEvento(int id);
    Task<Evento> AddEvento(Evento evento);
    Task<Evento?> UpdateEvento(int id, Evento evento);
    Task<Evento?> DeleteEvento(int id);
  }
}