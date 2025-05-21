using Eventos.Data;
using Eventos.Models;
using Microsoft.EntityFrameworkCore;

namespace Eventos.Services
{
  public class EventoService : IEventoService
  {
    private readonly EventosDbContext _context;

    public EventoService(EventosDbContext context)
    {
      _context = context;
    }

    public async Task<List<Evento>> GetAllEventos()
    {
      return await _context.eventos.ToListAsync();
    }

    public async Task<Evento?> GetEvento(int id)
    {
      return await _context.eventos.FindAsync(id);
    }

    public async Task<Evento> AddEvento(Evento evento)
    {
      _context.eventos.Add(evento);
      await _context.SaveChangesAsync();
      return evento;
    }

    public async Task<Evento?> UpdateEvento(int id, Evento evento)
    {
      var eventoExistente = await _context.eventos.FindAsync(id);
      if (eventoExistente == null)
      {
        return null;
      }

      eventoExistente.nombre = evento.nombre;
      eventoExistente.fecha = evento.fecha;
      eventoExistente.lugar = evento.lugar;
      eventoExistente.capacidad = evento.capacidad;
      eventoExistente.precio = evento.precio;

      await _context.SaveChangesAsync();
      return eventoExistente;
    }

    public async Task<Evento?> DeleteEvento(int id)
    {
      var evento = await _context.eventos.FindAsync(id);
      if (evento == null)
      {
        return null;
      }

      _context.eventos.Remove(evento);
      await _context.SaveChangesAsync();
      return evento;
    }
  }
}