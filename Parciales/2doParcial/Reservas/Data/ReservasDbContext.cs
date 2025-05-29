using Microsoft.EntityFrameworkCore;
using Reservas.Models;

namespace Reservas.Data
{
    public class ReservasDbContext : DbContext
    {
        public ReservasDbContext(DbContextOptions<ReservasDbContext> options) : base(options)
        {
        }

        // La forma correcta de declarar un DbSet con tipo genérico
        public DbSet<Reserva> reservas { get; set; } = null!;
    }
}