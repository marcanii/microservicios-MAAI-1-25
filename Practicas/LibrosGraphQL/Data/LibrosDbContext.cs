using Microsoft.EntityFrameworkCore;
using LibrosGraphQL.Models;

namespace LibrosGraphQL.Data
{
    public class LibrosDbContext : DbContext
    {
        public LibrosDbContext(DbContextOptions<LibrosDbContext> options) : base(options)
        {
        }

        // La forma correcta de declarar un DbSet con tipo genérico
        public DbSet<Libro> Libros { get; set; } = null!;
    }
}