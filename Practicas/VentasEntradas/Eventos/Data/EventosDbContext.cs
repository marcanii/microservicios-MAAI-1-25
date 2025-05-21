using Microsoft.EntityFrameworkCore;
using Eventos.Models;

namespace Eventos.Data
{
    public class EventosDbContext : DbContext
    {
        public EventosDbContext(DbContextOptions<EventosDbContext> options) : base(options)
        {
        }

        // La forma correcta de declarar un DbSet con tipo genérico
        public DbSet<Evento> eventos { get; set; } = null!;
    }
}